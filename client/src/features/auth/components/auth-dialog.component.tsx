"use client";

import { useMemo, useState } from "react";

import { Dialog } from "~/common/ui";

import { LoginForm } from "./login-form.component";
import { RegisterForm } from "./register-form.component";

interface AuthDialogProps {
  onClose: () => void;
}

export function AuthDialog({ onClose }: AuthDialogProps) {
  const [form, setForm] = useState<"login" | "register">("login");

  const formsData = useMemo(
    () => ({
      login: {
        component: <LoginForm />,
        title: "Sign in",
        description: "Sign in to your account to continue",
        footer: (
          <>
            Don&apos;t have an account?{" "}
            <button className=" text-white hover:text-gray-200" onClick={() => setForm("register")}>
              Sign up
            </button>
          </>
        ),
      },
      register: {
        component: <RegisterForm />,
        title: "Sign up",
        description: "Create your account to continue",
        footer: (
          <>
            Already have an account?{" "}
            <button className="text-white hover:text-gray-200" onClick={() => setForm("login")}>
              Sign in
            </button>
          </>
        ),
      },
    }),
    [],
  );

  return (
    <Dialog onClose={onClose}>
      <div className="flex flex-col gap-4 rounded-xl bg-background-primary p-6">
        <h1 className="text-center text-2xl font-semibold">{formsData[form].title}</h1>
        <p className="text-font-secondary text-center text-sm">{formsData[form].description}</p>
        {formsData[form].component}
        <p className="text-font-secondary text-center text-sm">{formsData[form].footer}</p>
      </div>
    </Dialog>
  );
}
