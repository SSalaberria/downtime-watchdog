"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import { CancelIcon } from "./icons";

interface DialogProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const Dialog = ({ children, onClose }: DialogProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <dialog
      open
      className={
        "absolute inset-0 flex h-full w-screen items-center justify-center bg-[#00000090] p-10 font-sans text-font sm:fixed"
      }
      onClick={() => onClose()}
    >
      <div
        className="absolute inset-0 z-40 flex flex-col gap-4 overflow-y-auto overflow-x-hidden rounded-xl bg-background-primary p-6 md:relative md:overflow-y-hidden"
        onClick={(e) => {
          e?.stopPropagation();
        }}
      >
        <CancelIcon className="ml-auto w-10 fill-primary sm:hidden" onClick={() => onClose()} />
        {children}
      </div>
    </dialog>,
    document.getElementById("portal-root")!,
  );
};
