'use client';

import { ReactNode, createContext, useContext } from 'react';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// Create context for Apollo Client
const ApolloClientContext = createContext<ApolloClient<any> | null>(null);

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return (
    <ApolloClientContext.Provider value={apolloClient}>
      {children}
    </ApolloClientContext.Provider>
  );
}

export function useApolloClient() {
  const client = useContext(ApolloClientContext);
  if (!client) {
    throw new Error('useApolloClient must be used within ApolloWrapper');
  }
  return client;
}
