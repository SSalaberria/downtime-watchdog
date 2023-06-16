import { Dashboard } from "~/features/dashboard";
import { GetDashboardDocument } from "~/features/dashboard/gql/documents.generated";
import { getClient } from "~/lib/apollo";

export default async function DashboardPage({ params }: { params: { dashboardId: string } }) {
  const { data } = await getClient().query({
    query: GetDashboardDocument,
    variables: { last: 20, _id: params.dashboardId },
  });

  return (
    <div>
      <Dashboard data={data.dashboard} />
    </div>
  );
}
