export type MissingTest = Readonly<{ source: string; expectedTest: string }>

const EXEMPT_FILES: ReadonlySet<string> = new Set(['main.tsx'])
const EXEMPT_DIRECTORIES: ReadonlyArray<string> = ['gql/']

const requiresTest = (file: string): boolean =>
  !EXEMPT_FILES.has(file) &&
  !EXEMPT_DIRECTORIES.some((directory) => file.startsWith(directory)) &&
  (file.endsWith('.tsx') || file.endsWith('.utils.ts'))

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
