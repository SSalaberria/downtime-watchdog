import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex h-screen w-full justify-center">
      <Image alt="Loading" className="h-12" height={48} src="/images/loading.svg" width={48} />
    </div>
  );
}
