"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";

import { Button } from "~/common/ui";
import { AuthDialog } from "~/features/auth";

interface CreateDashboardCTAProps {
  label: string;
}

export function CreateDashboardCTA({ label }: CreateDashboardCTAProps) {
  const { push } = useRouter();
  const [cookies] = useCookies(["token"]);
  const [openAuthDialog, setOpenAuthDialog] = useState(false);

  const handleAction = () => {
    if (cookies.token) {
      push("/dashboard");

      return;
    }

    setOpenAuthDialog(true);
  };

  return (
    <>
      <Button className="w-68 px-8 text-lg " variant="secondary" onClick={handleAction}>
        {label}
      </Button>
      {openAuthDialog && <AuthDialog onClose={() => setOpenAuthDialog(false)} />}
    </>
  );
}
