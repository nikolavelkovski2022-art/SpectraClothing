/**
 * Headless smoke test: mounts <App/> in a DOM shim and asserts the key
 * landing-page sections + shop and quote interactions render correctly.
 * Run with: npm test   (uses linkedom for a browser-like DOM)
 */
import { parseHTML } from 'linkedom'
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const here = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(here, '..')
// Keep the bundle inside the project so bare "react" imports resolve normally.
const bundlePath = path.join(here, `.smoke-bundle-${Date.now()}.mjs`)

// Bundle the JSX app (and its CSS imports) into a plain ESM file we can import.
// React is kept external so the test process holds the one and only copy.
await build({
  entryPoints: [path.join(here, '..', 'src', 'App.jsx')],
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
  outfile: bundlePath,
  loader: { '.css': 'empty' },
  logLevel: 'silent',
})

const { window, document } = parseHTML(
  '<!doctype html><html><body><div id="root"></div></body></html>',
)

if (!window.location) {
  window.location = {
    protocol: 'http:',
    host: 'localhost',
    hostname: 'localhost',
    href: 'http://localhost/',
    origin: 'http://localhost',
    pathname: '/',
    search: '',
    hash: '',
    reload() {},
  }
}

globalThis.window = window
globalThis.document = document
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
globalThis.HTMLElement = window.HTMLElement
globalThis.Element = window.Element
globalThis.Node = window.Node
globalThis.MouseEvent = window.MouseEvent
globalThis.Event = window.Event
globalThis.getComputedStyle =
  window.getComputedStyle?.bind(window) ?? (() => ({ getPropertyValue: () => '' }))

const { default: App } = await import(`file://${bundlePath.replace(/\\/g, '/')}`)
const { createElement } = await import('react')
const { createRoot } = await import('react-dom/client')

const container = document.getElementById('root')
createRoot(container).render(createElement(App))

// Let React flush its initial synchronous render.
await new Promise((r) => setTimeout(r, 50))

const checks = [
  ['brand wordmark', /SPECTRA/],
  ['Macedonian hero headline', /ТВОЈАТА МАШИНА/],
  ['Macedonian hero CTA', /Истражи ги налепниците/],
  ['dual currency display', /ден\./],
  ['painting service', /Фарбање мотори и коли/],
  ['custom decals service', /Персонализирани декали/],
  ['tuning brand product', /STAGE6/],
  ['Malossi products', /MALOSSI/],
  ['Polini products', /POLINI/],
  ['2Fast products', /2FAST/],
  ['RPG products', />RPG</],
  ['Metrakit products', /METRAKIT/],
  ['Doppler products', /DOPPLER/],
  ['Motoforce products', /MOTOFORCE/],
  ['product finish selector', /Холографска/],
  ['category filters', /Перформанси.*Тркање.*Спектра/],
  ['merch section', /СПЕКТРА ОБЛЕКА/],
  ['custom premium t-shirt', /Премиум маица/],
  ['custom hoodie', /Брендиран дуксер/],
  ['custom crewneck', /Премиум блуза/],
  ['merch colorways', /Мат црна.*Јаглеродна сива.*Кибер бела.*Неонски акцент/],
  ['merch size range', /XXL/],
  ['personalization preview input', /ТВОЈ ТЕКСТ \/ ПРЕКАР/],
  ['print placement selector', /ПОЗИЦИЈА НА ПЕЧАТОТ/],
  ['quote estimator', /КАЛКУЛАТОР ЗА ЦЕНА/],
  ['quote service choice', /Персонализирани декали/],
  ['plastic repair service', /Поправка на пластики/],
  ['four selectable quote services', /Изработка на маици/],
  ['email quote option', /ИСПРАТИ ГО БАРАЊЕТО ПО Е-ПОШТА/],
  ['studio trust element', /ОД ИДЕЈА ДО ФИНАЛНА ИЗРАБОТКА/],
  ['WhatsApp direct contact', /ПИШИ НИ ДИРЕКТНО/],
  ['portfolio', /ИЗБРАНИ ПРОЕКТИ/],
  ['contact form', /ТЕЛЕФОН \/ WHATSAPP/],
  ['reference photo upload', /type="file"/],
  ['Instagram contact', /SPECTRA\.KU/],
  ['footer', /SPECTRACUSTOMS\. СОЗДАДЕНО ЗА ПАТ/],
]

const html = container.innerHTML
const failed = []

for (const [name, pattern] of checks) {
  if (!pattern.test(html)) failed.push(name)
  else console.log(`PASS  ${name}`)
}

if (failed.length) {
  console.error('\nFAILED:', failed.join(' | '))
  process.exit(1)
}

async function selectValue(select, value) {
  Object.defineProperty(select, 'value', { configurable: true, get: () => value })
  select.dispatchEvent(new window.Event('change', { bubbles: true }))
  await new Promise(resolve => setTimeout(resolve, 30))
}

const serviceSelect = container.querySelector('.calculator .calc-label select')
await selectValue(serviceSelect, 'decals')
if (!container.querySelector('.sticker-designer') || !container.querySelector('.sticker-live-preview')) {
  failed.push('custom sticker designer opens for decal service')
} else console.log('PASS  custom sticker designer opens for decal service')

if (!container.querySelector('.sticker-live-preview')?.textContent.includes('SPECTRA') ||
    !decodeURIComponent(container.querySelector('.quote-submit')?.getAttribute('href') ?? '').includes('"SPECTRA"')) {
  failed.push('sticker preview and WhatsApp request include the design')
} else console.log('PASS  sticker preview and WhatsApp request include the design')

const designerToggle = container.querySelector('.designer-toggle')
designerToggle?.click()
await new Promise(resolve => setTimeout(resolve, 30))
if (container.querySelector('.designer-body')) failed.push('custom sticker designer can be collapsed')
else console.log('PASS  custom sticker designer can be collapsed')
container.querySelector('.designer-toggle')?.click()

await selectValue(serviceSelect, 'paint')
const scooterEstimate = container.querySelector('.estimate strong')?.textContent
const paintSelects = container.querySelectorAll('.calculator .calc-label select')
await selectValue(paintSelects[2], 'sportbike')
if (scooterEstimate === container.querySelector('.estimate strong')?.textContent) {
  failed.push('motorcycle type updates painting estimate')
} else console.log('PASS  motorcycle type updates painting estimate')
if (container.querySelectorAll('.paint-swatches button').length < 7 || !container.querySelector('.spectrum-control input[type="range"]')) {
  failed.push('paint color catalog and spectrum controls render')
} else console.log('PASS  paint color catalog and spectrum controls render')

await selectValue(serviceSelect, 'repair')
if (!container.textContent.includes('Скршен држач / носач')) {
  failed.push('plastic repair service exposes damage options')
} else console.log('PASS  plastic repair service exposes damage options')

await selectValue(serviceSelect, 'apparel')
if (!container.textContent.includes('Премиум маица') || !container.textContent.includes('КОЛИЧИНА') ||
    !container.querySelector('.quote-apparel-options') || !container.querySelector('.calculator input[placeholder="SPECTRA"]')) {
  failed.push('custom apparel service exposes garment and personalization choices')
} else console.log('PASS  custom apparel service exposes garment and personalization choices')

await selectValue(serviceSelect, 'paint')

const languageButtons = container.querySelectorAll('.header-actions .locale-group:first-child button')
const currencyButtons = container.querySelectorAll('.header-actions .currency-group button')
languageButtons[2].click()
await new Promise((r) => setTimeout(r, 30))
if (document.documentElement.lang !== 'en' || !container.innerHTML.includes('DESERVES PERFECTION.')) {
  failed.push('English switcher updates page language')
} else console.log('PASS  English switcher updates page language')
const englishContent = container.textContent.toLocaleUpperCase()
if (!englishContent.includes('MOTORCYCLE & CAR PAINTING') || !englishContent.includes('PREMIUM HEAVYWEIGHT TEE') || !englishContent.includes('PRICE ESTIMATOR') || !englishContent.includes('PROJECT DETAILS') || !englishContent.includes('PLASTIC REPAIR') || !englishContent.includes('COLOR SPECTRUM')) {
  failed.push('English translations cover service configurator and contact')
} else console.log('PASS  English translations cover service configurator and contact')

languageButtons[1].click()
await new Promise((r) => setTimeout(r, 30))
if (document.documentElement.lang !== 'sq' || !container.innerHTML.includes('MERITON PËRSOSMËRI.')) {
  failed.push('Albanian switcher updates page language')
} else console.log('PASS  Albanian switcher updates page language')
const albanianContent = container.textContent.toLocaleUpperCase()
if (!albanianContent.includes('LYERJE MOTOÇIKLETASH DHE MAKINASH') || !albanianContent.includes('LLOGARITËSI I ÇMIMIT') || !albanianContent.includes('DETAJET E PROJEKTIT') || !albanianContent.includes('RIPARIM I PLASTIKËS') || !albanianContent.includes('SPEKTRI I NGJYRAVE')) {
  failed.push('Albanian translations cover service configurator and contact')
} else console.log('PASS  Albanian translations cover service configurator and contact')

languageButtons[0].click()
currencyButtons[1].click()
await new Promise((r) => setTimeout(r, 30))
const firstMerchPrice = container.querySelector('.merch-title-row strong')?.textContent ?? ''
if (document.documentElement.lang !== 'mk' || !firstMerchPrice.includes('ден.') || !firstMerchPrice.startsWith('2')) {
  failed.push('Macedonian and MKD display preference')
} else console.log('PASS  Macedonian and MKD display preference')

if (!container.querySelector('.mobile-menu-scrim') && container.querySelector('.drawer-links') && container.querySelector('.site-nav .locale-controls')) {
  console.log('PASS  mobile drawer includes localized navigation and locale controls')
} else failed.push('mobile drawer locale controls')

container.querySelector('.merch-add')?.click()
await new Promise((r) => setTimeout(r, 30))
const cartItemBeforeLanguageChange = container.querySelector('.cart-item h3')?.textContent ?? ''
languageButtons[2].click()
await new Promise((r) => setTimeout(r, 30))
const cartItemAfterLanguageChange = container.querySelector('.cart-item h3')?.textContent ?? ''
if (cartItemBeforeLanguageChange !== 'Премиум маица' || cartItemAfterLanguageChange !== 'Premium heavyweight tee') {
  failed.push('cart contents update with selected language')
} else console.log('PASS  cart contents update with selected language')
currencyButtons[0].click()
await new Promise((r) => setTimeout(r, 30))
if (!container.querySelector('.cart-total strong')?.textContent.startsWith('€')) {
  failed.push('currency switch updates cart preferred price order')
} else console.log('PASS  currency switch updates cart preferred price order')

if (failed.length) {
  console.error('\nFAILED:', failed.join(' | '))
  process.exit(1)
}
console.log('\nAll render checks passed.')
fs.rmSync(bundlePath, { force: true })
