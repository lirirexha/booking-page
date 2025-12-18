'use client'

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { ReactNode } from 'react'

// this setup does NOT implement a real auth system
// only distinct queries that should be protected (demo-only graphql client)
// a real authentication system is yet to be worked on
const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER
const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS

const httpLink = createHttpLink({
  uri: '/api/graphql',
})

const authLink = setContext((_, { headers }) => {
  if (!ADMIN_USER || !ADMIN_PASS) {
    return { headers }
  }

  const token = btoa(`${ADMIN_USER}:${ADMIN_PASS}`)

  return {
    headers: {
      ...headers,
      authorization: `Basic ${token}`,
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default function Providers({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
