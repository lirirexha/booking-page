import { createYoga, createSchema } from 'graphql-yoga'
import { typeDefs } from '@/graphql/typeDefs'
import { resolvers } from '@/graphql/resolvers'

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Request, Response },
  context: ({ request }) => ({ request }),
})

export const GET = yoga
export const POST = yoga
