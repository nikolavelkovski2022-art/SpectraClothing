/**
 * Headless smoke test: mounts <App/> in a DOM shim and asserts the key
 * landing-page sections + customizer flow render correctly.
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
  ['logo wordmark', /SPECTRA/],
  ['hero headline', /Your idea/],
  ['hero CTA', /Start your design/],
  ['step 1 heading', /What are we printing on\?/],
  ['step 2 heading', /How should we build your design\?/],
  ['step 3 heading', /Place it on the/],
  ['garment option', /T-Shirt/],
  ['design option', /Upload a picture/],
  ['text option', /G\.O\.A\.T\./],
  ['size control', /Design size/],
  ['side control', /Front/],
  ['order button', /Send print request/],
  ['how it works', /From an idea to a printed piece/],
  ['reviews', /People wear their ideas/],
  ['faq', /Good to know/],
  ['footer', /Spectra Clothing\. All rights reserved\./],
]

const html = container.innerHTML
const failed = []

for (const [name, pattern] of checks) {
  if (!pattern.test(html)) failed.push(name)
  else console.log(`PASS  ${name}`)
}

// Structural assertions
const svgCount = (html.match(/<svg/g) || []).length
if (svgCount < 6) failed.push(`svg art present (found ${svgCount})`)
else console.log(`PASS  svg art present (${svgCount} svgs)`)

if (!html.includes('garment-svg')) failed.push('live preview stage')
else console.log('PASS  live preview stage')

if (!html.includes('dropzone')) failed.push('upload dropzone')
else console.log('PASS  upload dropzone')

if (failed.length) {
  console.error('\nFAILED:', failed.join(' | '))
  process.exit(1)
}
console.log('\nAll render checks passed.')
fs.rmSync(bundlePath, { force: true })
