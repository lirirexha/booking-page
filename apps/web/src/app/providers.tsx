'use client'

import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
} from '@apollo/client'
import { ReactNode } from 'react'

const client = new ApolloClient({
    uri: '/api/graphql',
    cache: new InMemoryCache(),
})

export default function Providers({ children }: { children: ReactNode }) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>
}
