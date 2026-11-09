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
  external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', '@supabase/supabase-js'],
  define: { 'import.meta.env.BASE_URL': JSON.stringify('/') },
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

if (!window.localStorage) {
  const storage = new Map()
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem(key) { return storage.get(key) ?? null },
      setItem(key, value) { storage.set(key, String(value)) },
    },
  })
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
  ['prices are not shown on the page', /^(?![\s\S]*(?:€\s?\d|\$\s?\d|\d[\d.,]*\s?(?:ден\.|MKD)))[\s\S]*$/],
  ['painting service', /Фарбање мотори и коли/],
  ['custom decals service', /Персонализирани декали/],
  ['tuning brand product', /STAGE6/],
  ['real Stage6 sticker sheet preview', /stickers-stage6\.png/],
  ['real Malossi sticker sheet preview', /stickers-malossi\.png/],
  ['real Polini sticker sheet preview', /stickers-polini\.png/],
  ['real 2Fast sticker logo preview', /stickers-2fast\.png/],
  ['real Doppler sticker sheet preview', /stickers-doppler\.png/],
  ['Malossi products', /MALOSSI/],
  ['Polini products', /POLINI/],
  ['2Fast products', /2FAST/],
  ['Doppler products', /DOPPLER/],
  ['RPG, Pro Race, and Factory stickers are removed', /^(?![\s\S]*(?:RPG|METRAKIT|MOTOFORCE|Pro Race|Factory серија|Factory Series))[\s\S]*$/],
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
  ['quote builder', /ПОДГОТВИ БАРАЊЕ/],
  ['quote service choice', /Персонализирани декали/],
  ['plastic repair service', /Поправка на пластики/],
  ['four selectable quote services', /Изработка на маици/],
  ['WhatsApp and Instagram quote actions', /ПИШИ НИ НА WHATSAPP[\s\S]*ПИШИ НИ НА INSTAGRAM/],
  ['studio trust element', /ОД ИДЕЈА ДО ФИНАЛНА ИЗРАБОТКА/],
  ['WhatsApp direct contact', /ПИШИ НИ ДИРЕКТНО/],
  ['theme color selector', /THEME COLOR|БОЈА НА ТЕМАТА/],
  ['four relaxing accent themes', /Лилакова.*Светло сина.*Нане.*Тиркизна/],
  ['navigation links to the riders community section', /href="#community">Заедница/],
  ['featured project marketing copy', /ТВОЈОТ СТИЛ\.[\s\S]*ТВОЈ ПОТПИС\./],
  ['featured project uses the supplied Aprilia photo', /spotlight-photo[\s\S]*spectra-aprilia-side\.png/],
  ['featured project links directly to WhatsApp', /spotlight-actions[\s\S]*wa\.me\/38971942295\?text=/],
  ['fan community gallery renders with a studio section', /НАШИТЕ ВОЗАЧИ\.[\s\S]*Supabase податоците за поврзување/],
  ['community gallery reports missing backend setup', /Supabase податоците за поврзување/],
  ['portfolio', /ИЗБРАНИ ПРОЕКТИ/],
  ['real vehicle, fairing, and custom decal portfolio images', /spectra-rally-car\.jpg[\s\S]*spectra-fairings\.jpg[\s\S]*spectra-custom-decals\.jpg/],
  ['portfolio project image set', /Spectra Rally \/ Corsa|spectra-rally-car\.jpg/],
  ['contact form', /ТЕЛЕФОН \/ WHATSAPP/],
  ['phone number at contact and page end', /\+389 71 942 295/],
  ['phone and WhatsApp connect to supplied number', /tel:\+38971942295|wa\.me\/38971942295/],
  ['Google Maps location for Zenix Zperformance', /Zenix Zperformance — Google Maps/],
  ['embedded Google Maps and directions link', /maps\.google\.com\/maps\?q=Zenix%20Zperformance%20Kumanovo&amp;output=embed|maps\.google\.com\/maps\?q=Zenix%20Zperformance%20Kumanovo&output=embed/],
  ['reference photo upload', /type="file"/],
  ['Instagram contact', /SPECTRA\.KU/],
  ['locally hosted Spectra project and apparel photos', /\/images\/spectra-(?:aprilia-side\.png|scooter|shirt|workshop)\.jpg/],
  ['footer', /SPECTRACUSTOMS\. СОЗДАДЕНО ЗА ПАТ/],
]

const html = container.innerHTML
const failed = []
const appSource = fs.readFileSync(path.join(projectRoot, 'src', 'App.jsx'), 'utf8')
const communitySql = fs.readFileSync(path.join(projectRoot, 'supabase', 'community.sql'), 'utf8')

for (const [name, pattern] of checks) {
  if (!pattern.test(html)) failed.push(name)
  else console.log(`PASS  ${name}`)
}
for (const [name, pattern] of [
  ['community registration and password login use Supabase Auth', /auth\.signUp[\s\S]*auth\.signInWithPassword/],
  ['community upload requires an image and size limit', /photo\.size > 8 \* 1024 \* 1024/],
  ['rejected posts are removed from the review queue and public gallery', /status === 'rejected'[\s\S]*storage\.from\('community-photos'\)\.remove/],
]) {
  if (!pattern.test(appSource)) failed.push(name)
  else console.log(`PASS  ${name}`)
}
for (const [name, pattern] of [
  ['community submissions are protected by row-level security', /alter table public\.community_submissions enable row level security/i],
  ['only admins can approve or reject submissions', /Only community admins can review submissions[\s\S]*is_community_admin\(\)/i],
  ['uploads require explicit publication consent', /publication_consent is true/i],
  ['community photos are private and file-size limited', /'community-photos',[\s\S]*false,[\s\S]*8388608/i],
  ['only approved community photos can be signed for public display', /Approved community images can be signed for display[\s\S]*status = 'approved'/i],
  ['anonymous visitors cannot query user account identifiers', /grant select \(id, image_path, display_name, vehicle, story, instagram, status, created_at\)[\s\S]*to anon/i],
]) {
  if (!pattern.test(communitySql)) failed.push(name)
  else console.log(`PASS  ${name}`)
}

const productImagePaths = Array.from(
  container.querySelectorAll('.product-visual img'),
  image => image.getAttribute('src') ?? '',
)
if (container.querySelectorAll('.product-card').length !== 6) {
  failed.push('sticker shop contains only six requested products')
} else console.log('PASS  sticker shop contains only six requested products')
for (const image of [
  'stickers-stage6.png',
  'stickers-malossi.png',
  'stickers-polini.png',
  'stickers-2fast.png',
  'stickers-doppler.png',
  'spectra-custom-decals.jpg',
]) {
  if (!productImagePaths.some(path => path.endsWith(image))) {
    failed.push(`product card loads ${image}`)
  } else console.log(`PASS  product card loads ${image}`)
}

if (container.querySelectorAll('.gallery-card').length !== 8 ||
    !container.innerHTML.includes('spectra-aprilia-side.png') ||
    !container.innerHTML.includes('spectra-aprilia-detail.png') ||
    !container.innerHTML.includes('spectra-aprilia-night.png')) {
  failed.push('the portfolio renders the five existing and three supplied photos')
} else console.log('PASS  the portfolio renders the five existing and three supplied photos')

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
if (!container.querySelector('.estimate strong')?.textContent.includes('ПО ДОГОВОР') ||
    !container.querySelector('.designer-body select option[value="fullMotor"]')?.textContent.includes('цел мотор')) {
  failed.push('full motorcycle sticker kit offers a quote without showing a price')
} else console.log('PASS  full motorcycle sticker kit offers a quote without showing a price')
const decalVehicleSelect = container.querySelectorAll('.calculator .calc-label select')[1]
await selectValue(decalVehicleSelect, 'car')
if (container.querySelector('.designer-body select option[value="fullMotor"]') ||
    !container.querySelector('.estimate strong')?.textContent.includes('ПО ДОГОВОР')) {
  failed.push('car decal selection keeps the agreed-price message')
} else console.log('PASS  car decal selection keeps the agreed-price message')
await selectValue(decalVehicleSelect, 'motorcycle')
const decalSizeSelect = container.querySelectorAll('.designer-body .designer-controls select')[1]
await selectValue(decalSizeSelect, 'fullMotor')

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
if (!scooterEstimate?.includes('ПО ДОГОВОР')) {
  failed.push('scooter paint shows price by agreement')
} else console.log('PASS  scooter paint shows price by agreement')
const paintSelects = container.querySelectorAll('.calculator .calc-label select')
await selectValue(paintSelects[2], 'sportbike')
if (scooterEstimate !== container.querySelector('.estimate strong')?.textContent) {
  failed.push('motorcycle type changes do not reveal a price')
} else console.log('PASS  motorcycle type changes do not reveal a price')
if (container.querySelectorAll('.paint-swatches button').length < 7 || !container.querySelector('.spectrum-control input[type="range"]')) {
  failed.push('paint color catalog and spectrum controls render')
} else console.log('PASS  paint color catalog and spectrum controls render')

await selectValue(serviceSelect, 'repair')
if (!container.textContent.includes('Скршен држач / носач')) {
  failed.push('plastic repair service exposes damage options')
} else console.log('PASS  plastic repair service exposes damage options')
if (!container.querySelector('.estimate strong')?.textContent.includes('ПО ДОГОВОР')) {
  failed.push('plastic repair displays the agreed-price message')
} else console.log('PASS  plastic repair displays the agreed-price message')

await selectValue(serviceSelect, 'apparel')
if (!container.textContent.includes('Премиум маица') || !container.textContent.includes('КОЛИЧИНА') ||
    !container.querySelector('.quote-apparel-options') || !container.querySelector('.calculator input[placeholder="SPECTRA"]')) {
  failed.push('custom apparel service exposes garment and personalization choices')
} else console.log('PASS  custom apparel service exposes garment and personalization choices')

await selectValue(serviceSelect, 'paint')

const languageButtons = container.querySelectorAll('.header-actions .locale-group:first-child button')
const themeButtons = container.querySelectorAll('.header-actions .theme-controls button')
if (themeButtons.length !== 4 || !themeButtons[3].getAttribute('aria-pressed') || document.documentElement.dataset.theme !== 'cyan') {
  failed.push('theme selector renders four options with the default cyan theme selected')
} else console.log('PASS  theme selector renders four options and selects cyan by default')
themeButtons[0].click()
await new Promise((r) => setTimeout(r, 30))
if (document.documentElement.dataset.theme !== 'lilac' || themeButtons[0].getAttribute('aria-pressed') !== 'true' ||
    window.localStorage?.getItem('spectra-theme') !== 'lilac') {
  failed.push('theme selector applies and remembers lilac accent')
} else console.log('PASS  theme selector applies and remembers lilac accent')
themeButtons[1].click()
await new Promise((r) => setTimeout(r, 30))
if (document.documentElement.dataset.theme !== 'blue') {
  failed.push('theme selector changes the accent to soft blue')
} else console.log('PASS  theme selector changes the accent to soft blue')
languageButtons[2].click()
await new Promise((r) => setTimeout(r, 30))
if (document.documentElement.lang !== 'en' || !container.innerHTML.includes('DESERVES PERFECTION.')) {
  failed.push('English switcher updates page language')
} else console.log('PASS  English switcher updates page language')
const englishContent = container.textContent.toLocaleUpperCase()
if (!container.querySelector('.header-actions .theme-controls button[aria-label="Lilac"]')) {
  failed.push('theme selector labels update with the English language')
} else console.log('PASS  theme selector labels update with the English language')
if (!englishContent.includes('YOUR SIGNATURE.') || !englishContent.includes('TALK ABOUT YOUR PROJECT') ||
    !container.querySelector('.spotlight-actions a[href^="https://wa.me/38971942295?text="]')) {
  failed.push('featured project marketing section translates and retains WhatsApp action in English')
} else console.log('PASS  featured project marketing section translates to English')
if (!englishContent.includes('MOTORCYCLE & CAR PAINTING') || !englishContent.includes('PREMIUM HEAVYWEIGHT TEE') || !englishContent.includes('BUILD YOUR REQUEST') || !englishContent.includes('PROJECT DETAILS') || !englishContent.includes('PLASTIC REPAIR') || !englishContent.includes('COLOR SPECTRUM') || !englishContent.includes('BY AGREEMENT')) {
  failed.push('English translations cover service configurator and contact')
} else console.log('PASS  English translations cover service configurator and contact')

languageButtons[1].click()
await new Promise((r) => setTimeout(r, 30))
if (document.documentElement.lang !== 'sq' || !container.innerHTML.includes('MERITON PËRSOSMËRI.')) {
  failed.push('Albanian switcher updates page language')
} else console.log('PASS  Albanian switcher updates page language')
const albanianContent = container.textContent.toLocaleUpperCase()
if (!albanianContent.includes('NËNSHKRIMI YT.') || !albanianContent.includes('FLISIM PËR PROJEKTIN TËND') ||
    !container.querySelector('.spotlight-actions a[href^="https://wa.me/38971942295?text="]')) {
  failed.push('featured project marketing section translates and retains WhatsApp action in Albanian')
} else console.log('PASS  featured project marketing section translates to Albanian')
if (!albanianContent.includes('LYERJE MOTOÇIKLETASH DHE MAKINASH') || !albanianContent.includes('PËRGATIT KËRKESËN') || !albanianContent.includes('DETAJET E PROJEKTIT') || !albanianContent.includes('RIPARIM I PLASTIKËS') || !albanianContent.includes('SPEKTRI I NGJYRAVE') || !albanianContent.includes('ME MARRËVESHJE')) {
  failed.push('Albanian translations cover service configurator and contact')
} else console.log('PASS  Albanian translations cover service configurator and contact')

languageButtons[0].click()
await new Promise((r) => setTimeout(r, 30))
if (document.documentElement.lang !== 'mk' || container.querySelector('.merch-title-row strong')) {
  failed.push('Macedonian display preference and no merch prices')
} else console.log('PASS  Macedonian display preference and no merch prices')

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
if (container.querySelector('.cart-item-info>strong') || container.querySelector('.cart-total strong')) {
  failed.push('cart selection contains no price totals')
} else console.log('PASS  cart selection contains no price totals')

if (failed.length) {
  console.error('\nFAILED:', failed.join(' | '))
  process.exit(1)
}
console.log('\nAll render checks passed.')
fs.rmSync(bundlePath, { force: true })
