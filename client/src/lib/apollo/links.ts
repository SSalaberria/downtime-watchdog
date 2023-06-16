import { setContext } from "@apollo/client/link/context";

import { TOKEN_KEY, getCookie } from "~/common";

export const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getCookie(TOKEN_KEY);

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      ...(token && {
        authorization: `Bearer ${token}`,
      }),
    },
  };
});
