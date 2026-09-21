import { err, ok, type Result } from '@/shared/result'

export type Config = Readonly<{
  port: number
  corsOrigins: ReadonlyArray<string>
  graphiql: boolean
}>

type Env = Readonly<Record<string, string | undefined>>

const DEFAULT_PORT = 4000
// The Vite dev server
const DEFAULT_CORS_ORIGINS: ReadonlyArray<string> = ['http://localhost:5173']

const parsePort = (raw: string | undefined): Result<number, string> => {
  if (raw === undefined) {
    return ok(DEFAULT_PORT)
  }
  const port = Number(raw)
  return /^\d+$/.test(raw) && port >= 1 && port <= 65_535
    ? ok(port)
    : err(`PORT must be an integer between 1 and 65535, got "${raw}"`)
}

const isHttpUrl = (value: string): boolean =>
  URL.canParse(value) && ['http:', 'https:'].includes(new URL(value).protocol)

const parseOrigin = (entry: string): Result<string, string> => {
  const origin = entry.trim()
  if (origin === '') {
    return err('CORS_ORIGINS contains an empty entry')
  }
  return isHttpUrl(origin)
    ? ok(new URL(origin).origin)
    : err(`CORS_ORIGINS entry "${origin}" is not an http(s) URL`)
}

const parseCorsOrigins = (raw: string | undefined): Result<ReadonlyArray<string>, string> => {
  if (raw === undefined) {
    return ok(DEFAULT_CORS_ORIGINS)
  }
  const origins = raw.split(',').map(parseOrigin)
  const failure = origins.find((origin) => !origin.ok)
  if (failure !== undefined) {
    return err(failure.error)
  }
  return ok(origins.flatMap((origin) => (origin.ok ? [origin.value] : [])))
}

export const parseConfig = (env: Env): Result<Config, string> => {
  const port = parsePort(env.PORT)
  if (!port.ok) {
    return port
  }
  const corsOrigins = parseCorsOrigins(env.CORS_ORIGINS)
  if (!corsOrigins.ok) {
    return corsOrigins
  }
  return ok({
    port: port.value,
    corsOrigins: corsOrigins.value,
    graphiql: env.NODE_ENV !== 'production',
  })
}
