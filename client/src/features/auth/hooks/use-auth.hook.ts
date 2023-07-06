import { useMutation } from "@apollo/client";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";

import { TOKEN_KEY } from "~/common";

import { LoginDocument, RegisterDocument } from "../gql/documents.generated";

export function useAuth() {
  const [, setCookie, removeCookie] = useCookies([TOKEN_KEY]);

  const LoginMutation = useMutation(LoginDocument, {
    onCompleted(data) {
      setAuthCookie(data.login.access_token);
    },
    onError(error) {
      console.error(error);
    },
  });

  const RegisterMutation = useMutation(RegisterDocument, {
    onCompleted(data) {
      setAuthCookie(data.register.access_token);

      toast("An email has been sent to your address, please verify it to enable notifications.", {
        icon: "📧",
        duration: 6000,
      });
    },
    onError(error) {
      console.error(error);
    },
  });

  const logout = () => {
    removeAuthCookie();
  };

  const removeAuthCookie = () => removeCookie(TOKEN_KEY, { path: "/" });

  const setAuthCookie = (token: string) =>
    setCookie(TOKEN_KEY, token, {
      path: "/",
      maxAge: 24 * 60 * 60 * 7,
    });

  return { LoginMutation, RegisterMutation, logout };
}
