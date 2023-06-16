"use client";

import { useMutation } from "@apollo/client";
import { useCallback } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

import { Button } from "~/common/ui/button";
import { TOKEN_KEY } from "~/common";

import { LoginDocument } from "../gql/documents.generated";

export function LoginForm() {
  const { push } = useRouter();
  const [, setCookie] = useCookies([TOKEN_KEY]);
  const [login, { loading, error }] = useMutation(LoginDocument, {
    onCompleted(data) {
      setCookie(TOKEN_KEY, data.login.access_token, { path: "/" });

      push("/dashboard");
    },
    onError(error) {
      console.error(error);
    },
  });

  const formFields = [
    { id: "email", label: "Email", type: "email" },
    { id: "password", label: "Password", type: "password" },
  ];

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const { email, password } = e.target as typeof e.target & {
        email: { value: string };
        password: { value: string };
      };

      await login({
        variables: { email: email.value, password: password.value },
      });
    },
    [login],
  );

  return (
    <form onSubmit={handleSubmit}>
      {formFields.map((field) => (
        <div key={field.id} className="mb-4 flex flex-col gap-2">
          <label htmlFor={field.id}>{field.label}</label>
          <input id={field.id} type={field.type} />
        </div>
      ))}

      {error && <p className="pb-1 text-center text-sm text-red-500">{error.message}</p>}
      <Button loading={loading} type="submit">
        Login
      </Button>
    </form>
  );
}
