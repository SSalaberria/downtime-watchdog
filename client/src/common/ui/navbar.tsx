import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const DynamicUserMenu = dynamic(() => import("~/features/user/components/user-menu.component"), {
  ssr: false,
  loading: () => <div className="h-9 w-16 animate-pulse rounded-lg bg-accent-1" />,
});

export function Navbar() {
  return (
    <nav className="flex h-24 items-center justify-between px-4 py-6">
      <Link className="flex items-center gap-2" href="/">
        <Image alt="logo" height={32} src="/images/logo.png" width={32} />{" "}
        <span>Downtime Watchdog</span>
      </Link>
      <div>
        <DynamicUserMenu />
      </div>
    </nav>
  );
}
