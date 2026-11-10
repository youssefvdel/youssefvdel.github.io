import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import type { Page } from 'playwright'

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4173'
const OUTPUT = fileURLToPath(new URL('../screens/', import.meta.url))
const SIZES = [
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'tablet-1024x768', width: 1024, height: 768 },
  { name: 'mobile-390x844', width: 390, height: 844 },
]

type Check = { ok: boolean; label: string; detail: string }
const checks: Check[] = []

function check(ok: boolean, label: string, detail: string) {
  checks.push({ ok, label, detail })
}

async function audit(page: Page, label: string) {
  const metrics = await page.evaluate(() => {
    const overflow = [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((element) => {
        const style = getComputedStyle(element)
        if (style.position === 'fixed' || style.position === 'absolute') return false
        const rect = element.getBoundingClientRect()
        return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1
      })
      .slice(0, 8)
      .map((element) => `${element.tagName.toLowerCase()}.${element.className || '(none)'}`)

    const contrast = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector)
      if (!element) return null
      const parse = (value: string) => {
        const [r, g, b] = value.match(/\d+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0]
        return [r, g, b].map((channel) => {
          const c = channel / 255
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
        })
      }
      const luminance = (rgb: number[]) => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
      const fg = luminance(parse(getComputedStyle(element).color))
      const bg = luminance(parse(getComputedStyle(document.body).backgroundColor))
      return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05)
    }

    const reveals = [...document.querySelectorAll<HTMLElement>('.reveal')]
    const revealState = reveals.every(
      (element) => getComputedStyle(element).opacity === '1' && getComputedStyle(element).transform === 'none',
    )

    return {
      h1: document.querySelectorAll('h1').length,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      overflow,
      fonts: [...document.fonts].map((font) => `${font.family}:${font.status}`),
      bodyContrast: contrast('.hero-sub'),
      mutedContrast: contrast('.work-blurb'),
      revealState,
      live: Boolean(document.querySelector('.status-summary')),
      fallback: Boolean(document.querySelector('.status-offline')),
      summary: document.querySelector('.status-summary')?.textContent?.replace(/\s+/g, ' ').trim() ?? null,
    }
  })

  check(metrics.h1 === 1, `${label} one h1`, String(metrics.h1))
  check(
    metrics.scrollWidth <= metrics.clientWidth,
    `${label} no horizontal overflow`,
    `${metrics.scrollWidth}/${metrics.clientWidth}`,
  )
  check(metrics.overflow.length === 0, `${label} no elements past the edge`, metrics.overflow.join(', ') || 'clean')
  check(metrics.fonts.every((font) => font.endsWith(':loaded')), `${label} fonts loaded`, metrics.fonts.join(', '))
  check(metrics.revealState, `${label} reduced-motion content visible`, 'all .reveal at opacity 1, no transform')
  check((metrics.bodyContrast ?? 0) >= 4.5, `${label} body contrast`, `${(metrics.bodyContrast ?? 0).toFixed(2)}:1`)
  check((metrics.mutedContrast ?? 0) >= 4.5, `${label} muted contrast`, `${(metrics.mutedContrast ?? 0).toFixed(2)}:1`)
  check(metrics.live || metrics.fallback, `${label} status panel resolved`, metrics.summary ?? 'fallback')

  await page.keyboard.press('Tab')
  const focus = await page.evaluate(() => {
    const active = document.activeElement
    if (!active) return null
    const style = getComputedStyle(active)
    return { tag: active.tagName, label: active.textContent?.trim().slice(0, 30), outline: style.outlineStyle, color: style.outlineColor }
  })
  check(
    Boolean(focus && focus.outline !== 'none'),
    `${label} visible focus ring`,
    focus ? `${focus.tag} "${focus.label}" ${focus.outline} ${focus.color}` : 'none',
  )

  return metrics
}

const browser = await chromium.launch()

try {
  await mkdir(OUTPUT, { recursive: true })

  for (const size of SIZES) {
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(700)

    await audit(page, size.name)
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
    await page.screenshot({ path: `${OUTPUT}${size.name}.png`, fullPage: true })
    await page.screenshot({ path: `${OUTPUT}viewport-${size.name}.png` })
    console.log(`captured ${size.name}.png + viewport-${size.name}.png`)

    if (size.name === 'desktop-1440x900') {
      const lab = await page.locator('#lab').boundingBox()
      if (lab) {
        await page.screenshot({
          path: `${OUTPUT}lab-live-1440.png`,
          fullPage: true,
          clip: { x: 0, y: lab.y, width: size.width, height: lab.height },
        })
        console.log('captured lab-live-1440.png')
      }
    }

    await context.close()
  }

  // Fallback state (GitHub Pages / any origin without the status endpoint).
  const fallbackContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  })
  const fallbackPage = await fallbackContext.newPage()
  await fallbackPage.route('**/api/status', (route) => route.fulfill({ status: 404, body: 'not found' }))
  await fallbackPage.goto(BASE_URL, { waitUntil: 'networkidle' })
  await fallbackPage.evaluate(() => document.fonts.ready)
  await fallbackPage.waitForTimeout(500)
  const fallbackCopy = await fallbackPage.locator('.offline-copy').innerText()
  check(fallbackCopy.includes('Live status is served from the box'), 'fallback copy', fallbackCopy.replace(/\s+/g, ' '))
  await fallbackPage.screenshot({ path: `${OUTPUT}fallback-1440.png`, fullPage: true })
  console.log('captured fallback-1440.png')
  await fallbackContext.close()
} finally {
  await browser.close()
}

const failed = checks.filter((entry) => !entry.ok)
for (const entry of checks) {
  console.log(`${entry.ok ? 'PASS' : 'FAIL'}  ${entry.label} — ${entry.detail}`)
}

if (failed.length > 0) {
  console.error(`\n${failed.length} check(s) failed`)
  process.exit(1)
}

console.log(`\n${checks.length} checks passed`)
