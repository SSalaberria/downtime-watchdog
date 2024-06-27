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
    >
      <div
        className="absolute inset-0 z-40 flex flex-col overflow-y-auto overflow-x-hidden rounded-xl bg-background-primary p-6 md:relative md:overflow-y-hidden"
        onClick={(e) => {
          e?.stopPropagation();
        }}
      >
        <CancelIcon
          className=" ml-auto w-8 cursor-pointer hover:stroke-gray-500"
          onClick={() => onClose()}
        />
        {children}
      </div>
    </dialog>,
    document.getElementById("portal-root")!,
  );
};
