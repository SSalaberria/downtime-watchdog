"use client";

import { ApolloClient, ApolloLink, HttpLink, SuspenseCache } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { setVerbosity } from "ts-invariant";

import { env } from "~/env.mjs";

import { authLink } from "./links";

setVerbosity("debug");

function makeClient() {
  const httpLink = new HttpLink({
    uri: env.NEXT_PUBLIC_GRAPHQL_URL,
  });

  return new ApolloClient({
    cache: new NextSSRInMemoryCache(),
    connectToDevTools: true,
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            authLink,
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : ApolloLink.from([authLink, httpLink]),
  });
}

function makeSuspenseCache() {
  return new SuspenseCache();
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient} makeSuspenseCache={makeSuspenseCache}>
      {children}
    </ApolloNextAppProvider>
  );
}
