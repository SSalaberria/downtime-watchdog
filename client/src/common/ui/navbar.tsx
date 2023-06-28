import Image from "next/image";

export function Navbar() {
  return (
    <nav className="flex items-center gap-2 px-4 py-6">
      <Image alt="logo" height={32} src="/images/logo.png" width={32} />{" "}
      <span>Downtime Watchdog</span>
    </nav>
  );
}
