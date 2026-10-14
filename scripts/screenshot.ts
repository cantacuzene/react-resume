import { chromium } from 'playwright'

// Visual check of the running app: `bun run screenshot [url] [outDir]`.
// Needs `bun run dev` and `bun run dev:server`; writes one file per viewport and language.
const [url = 'http://localhost:5173', outDir = 'screenshots'] = process.argv.slice(2)

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const

const browser = await chromium.launch()

const shots = await Promise.all(
  VIEWPORTS.map(async ({ name, width, height }) => {
    const page = await browser.newPage({ viewport: { width, height } })

    await page.goto(url, { waitUntil: 'networkidle' })
    // The header only exists once the query resolved
    await page.getByRole('banner').waitFor()

    const path = `${outDir}/${name}.png`
    await page.screenshot({ path, fullPage: true })
    await page.close()

    return path
  }),
)

await browser.close()

shots.forEach((path) => {
  console.log(`screenshot: ${path}`)
})
