import type { RequestHandler } from 'msw'

// Default handlers shared by all tests. Sub-project 2 adds the ResumePage GraphQL handlers.
export const handlers: ReadonlyArray<RequestHandler> = []
