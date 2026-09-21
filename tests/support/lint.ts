import { ESLint } from 'eslint'

// Virtual files linted by the rule tests. They must never exist on disk.
export const VIRTUAL_FILES = {
  source: 'src/__lint__.ts',
  api: 'src/api/__lint__.ts',
  component: 'src/components/__lint__.tsx',
  test: 'tests/__lint__.test.tsx',
  config: '__lint__.config.ts',
} as const

type VirtualFile = (typeof VIRTUAL_FILES)[keyof typeof VIRTUAL_FILES]

const eslint = new ESLint({
  overrideConfig: {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: Object.values(VIRTUAL_FILES),
          defaultProject: 'tsconfig.json',
        },
      },
    },
  },
})

export const lintViolations = async (
  filePath: VirtualFile,
  code: string,
): Promise<ReadonlyArray<string>> => {
  const [result] = await eslint.lintText(code, { filePath })

  if (result === undefined) {
    throw new Error(`ESLint returned no result for ${filePath}`)
  }

  const fatal = result.messages.find((message) => message.fatal === true)

  if (fatal !== undefined) {
    throw new Error(`ESLint could not parse ${filePath}: ${fatal.message}`)
  }

  return result.messages.map((message) => message.ruleId ?? 'unknown')
}

export const isIgnored = (filePath: string): Promise<boolean> => eslint.isPathIgnored(filePath)
