import { createPortal } from "react-dom";

interface DialogProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const Dialog = ({ children, onClose }: DialogProps) => {
  return createPortal(
    <dialog
      open
      className={
        "absolute inset-0 flex h-full w-screen items-center justify-center bg-[#00000090] p-10 font-sans text-font sm:fixed"
      }
      onClick={() => onClose()}
    >
      <div
        className="relative z-40 flex flex-col gap-4 rounded-xl bg-background-primary p-6"
        onClick={(e) => {
          e?.stopPropagation();
        }}
      >
        {children}
      </div>
    </dialog>,
    document.getElementById("portal-root")!,
  );
};
