import { TrackerInput } from "~/features/dashboard";

import { UserDashboard } from "./user-dashboard";
// export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // const cookieStore = cookies();

  // const { data } = await getClient().query({
  //   query: GetUserDashboardDocument,
  //   context: {
  //     headers: {
  //       authorization: `Bearer ${cookieStore.get("token")?.value}`,
  //     },
  //   },
  // });

  return (
    <div className="flex flex-col items-center">
      <TrackerInput className=" w-full sm:w-72" />
      {/* <Dashboard data={data.userDashboard} showActions={true} /> */}
      <UserDashboard />
    </div>
  );
}