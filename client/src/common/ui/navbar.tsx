import Image from "next/image";

import { LogoutIcon } from "./icons";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-6">
      <div className="flex items-center gap-2">
        <Image alt="logo" height={32} src="/images/logo.png" width={32} />{" "}
        <span>Downtime Watchdog</span>
      </div>
      <div className="">
        <button>
          <LogoutIcon className=" w-8 fill-gray-500 hover:fill-gray-400" />
        </button>
      </div>
    </nav>
  );
}
