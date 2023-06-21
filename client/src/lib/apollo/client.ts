import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

import { env } from "~/env.mjs";

import { authLink, errorLink } from "./links";

// Usable for RSC

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    connectToDevTools: true,
    link: ApolloLink.from([
      authLink,
      errorLink,
      new HttpLink({
        // https://studio.apollographql.com/public/spacex-l4uc6p/
        uri: env.NEXT_PUBLIC_GRAPHQL_URL,

        // you can disable result caching here if you want to
        // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
        // fetchOptions: { cache: "no-store" },
      }),
    ]),
  });
});
