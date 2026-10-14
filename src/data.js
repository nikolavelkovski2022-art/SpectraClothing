/**
 * Spectra Clothing — catalogue data.
 *
 * Pricing is illustrative (USD) and used by the estimator in the customizer.
 * Garment line-art is authored as inline SVG strings (black & white only) so the
 * site has zero remote image dependencies and stays crisp at any zoom level.
 */

export const GARMENT_TYPES = [
  {
    id: 'tshirt',
    label: 'T-Shirt',
    tagline: 'Classic heavyweight cotton',
    basePrice: 18,
    designPrice: 6,
  },
  {
    id: 'shirt',
    label: 'Shirt',
    tagline: 'Crisp button-down, any fabric',
    basePrice: 32,
    designPrice: 8,
  },
  {
    id: 'trousers',
    label: 'Trousers',
    tagline: 'Chinos, cargos & tailored fits',
    basePrice: 38,
    designPrice: 8,
  },
  {
    id: 'hoodie',
    label: 'Hoodie',
    tagline: 'Heavy fleece, brushed inside',
    basePrice: 42,
    designPrice: 7,
  },
]

export const DESIGN_TYPES = [
  {
    id: 'upload',
    label: 'Upload a picture',
    tagline: 'A photo, a drawing, a logo — anything you already have',
  },
  {
    id: 'text',
    label: 'Text / letters',
    tagline: 'Like "G.O.A.T." — set your own words, font and style',
  },
  {
    id: 'combo',
    label: 'Picture + text',
    tagline: 'Combine your upload with captions and labels',
  },
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const PRINT_SIDES = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
]

export const GARMENT_COLORS = [
  { id: 'black', label: 'Black', hex: '#0d0d0d', soft: '#161616', ink: '#ffffff' },
  { id: 'white', label: 'White', hex: '#f6f6f4', soft: '#e9e9e6', ink: '#0d0d0d' },
  { id: 'grey', label: 'Grey', hex: '#9c9c9c', soft: '#8a8a8a', ink: '#0d0d0d' },
  { id: 'sand', label: 'Sand', hex: '#cdbfa6', soft: '#bfae92', ink: '#0d0d0d' },
]

export const SIDE_PRICING = {
  1: 0,
  2: 4,
}

/**
 * Line-art for each garment x side.
 * viewBox is 320 x 400; `printZones` describe where a design may live.
 */
export const GARMENT_ART = {
  tshirt: {
    front: `
      <path d="M108 74 L74 92 L38 138 L74 170 L94 146 L94 328 Q160 340 226 328 L226 146 L246 170 L282 138 L246 92 L212 74
               C200 96 120 96 108 74 Z" />
      <path d="M108 74 C124 104 196 104 212 74" class="soft" />
      <path d="M94 320 Q160 332 226 320" class="soft" />
    `,
    back: `
      <path d="M108 74 L74 92 L38 138 L74 170 L94 146 L94 328 Q160 340 226 328 L226 146 L246 170 L282 138 L246 92 L212 74
               C202 88 118 88 108 74 Z" />
      <path d="M110 80 C130 92 190 92 210 80" class="soft" />
      <path d="M94 320 Q160 332 226 320" class="soft" />
    `,
    printZones: {
      front: { x: 94, y: 110, w: 132, h: 210, label: 'front chest / belly' },
      back: { x: 94, y: 110, w: 132, h: 210, label: 'full back' },
    },
  },
  shirt: {
    front: `
      <path d="M110 72 L72 90 L36 138 L72 172 L92 148 L92 330 Q160 342 228 330 L228 148 L248 172 L284 138 L248 90 L210 72
               L160 100 Z" />
      <path d="M110 72 L160 100 L210 72 L196 64 L160 86 L124 64 Z" class="soft" />
      <path d="M160 100 L160 330" class="soft" />
      <circle cx="160" cy="140" r="3.2" class="dot" />
      <circle cx="160" cy="186" r="3.2" class="dot" />
      <circle cx="160" cy="232" r="3.2" class="dot" />
      <circle cx="160" cy="278" r="3.2" class="dot" />
      <path d="M104 122 L134 122 L134 156 Q119 164 104 156 Z" class="soft" />
      <path d="M186 122 L216 122 L216 156 Q201 164 186 156 Z" class="soft" />
      <path d="M92 322 Q160 334 228 322" class="soft" />
    `,
    back: `
      <path d="M110 72 L72 90 L36 138 L72 172 L92 148 L92 330 Q160 342 228 330 L228 148 L248 172 L284 138 L248 90 L210 72
               C200 86 120 86 110 72 Z" />
      <path d="M112 78 C132 92 188 92 208 78" class="soft" />
      <path d="M100 96 Q160 112 220 96" class="soft" />
      <path d="M92 322 Q160 334 228 322" class="soft" />
    `,
    printZones: {
      front: { x: 92, y: 168, w: 136, h: 150, label: 'front body (under the placket)' },
      back: { x: 96, y: 112, w: 128, h: 200, label: 'full back' },
    },
  },
  trousers: {
    front: `
      <path d="M98 64 L222 64 L232 132 L226 340 L182 340 L172 190 L160 232 L148 190 L138 340 L94 340 L88 132 Z" />
      <path d="M98 78 Q160 90 222 78" class="soft" />
      <path d="M160 96 L160 232" class="soft" />
      <path d="M108 104 L128 112" class="soft" />
      <path d="M212 104 L192 112" class="soft" />
      <path d="M160 128 L182 128 L182 152 L160 152 Z" class="soft" />
    `,
    back: `
      <path d="M98 64 L222 64 L232 132 L226 340 L182 340 L172 190 L160 232 L148 190 L138 340 L94 340 L88 132 Z" />
      <path d="M98 78 Q160 90 222 78" class="soft" />
      <path d="M112 122 L146 118 L150 154 L116 158 Z" class="soft" />
      <path d="M170 118 L204 122 L200 158 L166 154 Z" class="soft" />
      <path d="M160 96 L160 190" class="soft" />
    `,
    printZones: {
      front: { x: 128, y: 176, w: 64, h: 150, label: 'front thigh' },
      back: { x: 150, y: 168, w: 64, h: 158, label: 'back leg' },
    },
  },
  hoodie: {
    front: `
      <path d="M112 84 L72 102 L38 152 L76 186 L96 160 L96 330 Q160 342 224 330 L224 160 L244 186 L282 152 L248 102 L208 84
               C198 62 122 62 112 84 Z" />
      <path d="M112 84 C124 118 196 118 208 84" class="soft" />
      <path d="M132 214 L188 214 L188 258 Q160 270 132 258 Z" class="soft" />
      <path d="M146 118 L142 168" class="soft" />
      <path d="M174 118 L178 168" class="soft" />
      <path d="M96 322 Q160 334 224 322" class="soft" />
    `,
    back: `
      <path d="M112 84 L72 102 L38 152 L76 186 L96 160 L96 330 Q160 342 224 330 L224 160 L244 186 L282 152 L248 102 L208 84
               C198 68 122 68 112 84 Z" />
      <path d="M112 92 C128 112 192 112 208 92" class="soft" />
      <path d="M96 322 Q160 334 224 322" class="soft" />
    `,
    printZones: {
      front: { x: 96, y: 168, w: 128, h: 150, label: 'front belly (under the pocket)' },
      back: { x: 96, y: 120, w: 128, h: 195, label: 'full back' },
    },
  },
}

export const TESTIMONIALS = [
  {
    quote:
      'Sent them a photo of my dog at 11pm, had a perfect tee in two days. The placement tool meant it came out exactly how I pictured it.',
    name: 'Amara O.',
    meta: 'Custom tee · front + back print',
  },
  {
    quote:
      'We printed 40 matching shirts for our five-a-side team. The G.O.A.T. lettering on the back looked razor sharp.',
    name: 'Diego R.',
    meta: 'Team order · 40 pieces',
  },
  {
    quote:
      'I design posters for a living, so I am picky about print quality. Spectra is the only local shop I trust with my artwork.',
    name: 'Lena K.',
    meta: 'Artist collab · limited run',
  },
]

export const FAQS = [
  {
    q: 'What file formats can I upload?',
    a: 'PNG, JPG, SVG or WEBP. For the sharpest print, send a PNG or SVG with a transparent background and at least 2000px on the longest side.',
  },
  {
    q: 'How does pricing work?',
    a: 'Every order starts with the base price of the garment. Each print side and each design add a small flat fee — you see the estimate update live in the customizer before you ever send us a request.',
  },
  {
    q: 'Can I print on both front and back?',
    a: 'Yes. Switch between Front and Back in the customizer and place a design on each side independently. Your order summary lists both.',
  },
  {
    q: 'How long does it take?',
    a: 'Standard orders are ready in 2–4 business days. Bulk orders over 25 pieces usually take 5–7 business days. We will confirm the timeline when we reply to your request.',
  },
  {
    q: 'Do you help with the design?',
    a: 'Absolutely. If you have an idea but no artwork, describe it in the notes field and our designer will mock it up for you before printing.',
  },
]
