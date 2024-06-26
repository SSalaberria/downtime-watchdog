"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { Button } from "~/common/ui/button";

import { useAuth } from "../hooks";

export function RegisterForm() {
  const { push } = useRouter();
  const [register, { loading, error }] = useAuth().RegisterMutation;

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
      }).then(() => push("/dashboard"));
    },
    [register, push],
  );

  return (
    <form onSubmit={handleSubmit}>
      {formFields.map((field) => (
        <div key={field.id} className="mb-4 flex flex-col gap-2">
          <label htmlFor={field.id}>{field.label}</label>
          <input id={field.id} type={field.type} />
        </div>
      ))}

      {error && (
        <p className="pb-1 text-center text-sm text-red-500 first-letter:capitalize">
          {error.message}
        </p>
      )}
      <Button loading={loading} type="submit">
        Sign Up
      </Button>
    </form>
  );
}
