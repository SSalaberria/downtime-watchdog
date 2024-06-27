import { CreateDashboardCTA, DashboardCC } from "~/features/dashboard";

export default async function HomePage() {
  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="flex w-full flex-col items-center justify-between gap-8 md:h-[calc(100vh-5rem)] md:flex-row md:px-20">
          <div className="flex flex-col items-center gap-8 pt-8 text-center md:items-start md:pt-0 md:text-start">
            <h1 className="text-3xl font-bold text-primary md:text-5xl">
              A simple way to <br /> track your website&apos;s uptime
            </h1>
            <p className=" text-primary">
              Setup your own tracking dashboard to monitor your website&apos;s availability <br />
              and get notified when it goes down.
            </p>
            <div>
              <CreateDashboardCTA label="Get Started" />
            </div>
          </div>
          <div className="">
            <DashboardCC stacked />
          </div>
        </div>
      </div>
    </>
  );
}
