import { existsSync, readdirSync } from 'node:fs'
import { sep } from 'node:path'
import { missingTests } from './lib/missingTests'

const listFiles = (directory: string): ReadonlyArray<string> =>
  existsSync(directory)
    ? readdirSync(directory, { recursive: true, encoding: 'utf8' }).map((file) =>
        file.split(sep).join('/'),
      )
    : []

const missing = missingTests(listFiles('src'), listFiles('tests'))

if (missing.length > 0) {
  console.error('Missing tests (docs/guidelines/frontend.md §4, backend.md §2):')
  missing.forEach(({ source, expectedTest }) => {
    console.error(`  src/${source} → tests/${expectedTest}`)
  })
  process.exit(1)
}

console.log('check-tests: every component, utils, server and shared module has a test')
