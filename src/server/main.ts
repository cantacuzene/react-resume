import { parseConfig } from '@/server/config.utils'
import { createServer } from '@/server/yoga'

// The only side-effecting server module: reads the environment and binds the port
const config = parseConfig(process.env)

if (!config.ok) {
  console.error(`Invalid configuration: ${config.error}`)
  process.exit(1)
}

const server = Bun.serve({ port: config.value.port, fetch: createServer(config.value) })

console.log(`GraphQL API listening on ${new URL('/graphql', server.url).href}`)
