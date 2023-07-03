import { useQuery } from "@apollo/client";
import { useCookies } from "react-cookie";

import { GetUserDataDocument } from "../gql/documents.generated";

export function useUser() {
  const [cookies] = useCookies();

  const userQuery = useQuery(GetUserDataDocument, {
    skip: !cookies.token,
  });

  return { ...userQuery, token: cookies.token };
}
