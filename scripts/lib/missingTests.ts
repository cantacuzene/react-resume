export type MissingTest = Readonly<{ source: string; expectedTest: string }>

const EXEMPT_FILES: ReadonlySet<string> = new Set([
  'client/main.tsx',
  'server/main.ts',
  'server/content/shared.ts',
  'server/content/fr.ts',
  'server/content/en.ts',
])

// src/client/gql/, src/server/gql/: generated code
const GENERATED_FILE = /^[^/]+\/gql\//

const isClientComponentOrUtils = (file: string): boolean =>
  file.startsWith('client/') && (file.endsWith('.tsx') || file.endsWith('.utils.ts'))

const isServerOrSharedModule = (file: string): boolean =>
  (file.startsWith('server/') || file.startsWith('shared/')) && file.endsWith('.ts')

const requiresTest = (file: string): boolean =>
  !EXEMPT_FILES.has(file) &&
  !GENERATED_FILE.test(file) &&
  (isClientComponentOrUtils(file) || isServerOrSharedModule(file))

const toTestPath = (file: string): string => file.replace(/\.(tsx|ts)$/, '.test.$1')

export const missingTests = (
  sourceFiles: ReadonlyArray<string>,
  testFiles: ReadonlyArray<string>,
): ReadonlyArray<MissingTest> => {
  const existingTests: ReadonlySet<string> = new Set(testFiles)

  return sourceFiles
    .filter(requiresTest)
    .map((source) => ({ source, expectedTest: toTestPath(source) }))
    .filter(({ expectedTest }) => !existingTests.has(expectedTest))
}
