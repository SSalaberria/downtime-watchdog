"use client";

import { memo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "~/common/ui";
import { AuthDialog, useAuth } from "~/features/auth";

import { useUser } from "../hooks";

const UserMenu = memo(function UserMenu() {
  const { data, token, loading, error } = useUser();
  const { logout } = useAuth();
  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const { push } = useRouter();

  if (error || !token) {
    return (
      <>
        <Button onClick={() => setOpenAuthDialog(true)}>Sign In</Button>
        {openAuthDialog && <AuthDialog onClose={() => setOpenAuthDialog(false)} />}
      </>
    );
  }

  if (loading) {
    return <div className="h-6 w-24 animate-pulse rounded-xl bg-accent-1" />;
  }

  const menuOptions = [
    { label: "My Dashboard", onClick: () => push("/dashboard") },
    {
      label: "Sign Out",
      onClick: () => {
        logout();
        push("/");
      },
    },
  ];

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center rounded-md bg-gray-200 p-2 focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-sm font-medium text-gray-700">{data?.user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 rounded-md bg-accent-1 shadow-lg">
          <ul className=" ">
            {menuOptions.map((option) => (
              <li
                key={option.label}
                className="flex w-max min-w-full cursor-pointer px-4 py-2 hover:bg-accent-2 first:hover:rounded-t-md last:hover:rounded-b-md "
                onClick={() => {
                  option.onClick();
                  setOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default UserMenu;
