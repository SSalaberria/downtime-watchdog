import { Dashboard } from "~/features/dashboard";
import { GetDashboardDocument } from "~/features/dashboard/gql/documents.generated";
import { getClient } from "~/lib/apollo";

export default async function DashboardPage({ params }: { params: { dashboardId: string } }) {
  const { data } = await getClient().query({
    query: GetDashboardDocument,
    variables: { _id: params.dashboardId },
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-medium text-white">{`${data.dashboard.owner.name}'s dashboard`}</h1>

      <Dashboard data={data.dashboard} />
    </div>
  );
}
