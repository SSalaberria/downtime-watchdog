"use client";

import { useMutation } from "@apollo/client";
import { useCallback } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

import { Button } from "~/common/ui/button";
import { TOKEN_KEY } from "~/common";

import { LoginDocument, RegisterDocument } from "../gql/documents.generated";

export function RegisterForm() {
  const { push } = useRouter();
  const [, setCookie] = useCookies([TOKEN_KEY]);
  const [register, { loading, error }] = useMutation(RegisterDocument, {
    onCompleted(data) {
      setCookie(TOKEN_KEY, data.register.access_token, { path: "/" });

      push("/dashboard");
    },
    onError(error) {
      console.error(error);
    },
  });

  const formFields = [
    { id: "email", label: "Email", type: "email" },
    { id: "name", label: "Username", type: "text" },
    { id: "password", label: "Password", type: "password" },
    { id: "repeatedPassword", label: "Repeat password", type: "password" },
  ];

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const { email, password, repeatedPassword, name } = e.target as typeof e.target & {
        email: { value: string };
        password: { value: string };
        repeatedPassword: { value: string };
        name: { value: string };
      };

      if (password.value !== repeatedPassword.value) {
        return;
      }

      await register({
        variables: { email: email.value, password: password.value, name: name.value },
      });
    },
    [register],
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
        Sign up
      </Button>
    </form>
  );
}
