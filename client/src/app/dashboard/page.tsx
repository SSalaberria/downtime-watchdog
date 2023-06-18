import { cookies } from "next/headers";

import { Dashboard, TrackerInput } from "~/features/dashboard";
import { GetUserDashboardDocument } from "~/features/dashboard/gql/documents.generated";
import { getClient } from "~/lib/apollo";
// export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = cookies();

  const { data } = await getClient().query({
    query: GetUserDashboardDocument,
    context: {
      headers: {
        authorization: `Bearer ${cookieStore.get("token")?.value}`,
      },
    },
  });

  return (
    <div className="flex flex-col items-center">
      <TrackerInput className=" w-full sm:w-72" />
      <Dashboard data={data.userDashboard} showActions={true} />
    </div>
  );
}
