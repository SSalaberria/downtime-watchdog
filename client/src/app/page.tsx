import { CreateDashboardCTA, Dashboard } from "~/features/dashboard";
import { GetDashboardDocument } from "~/features/dashboard/gql/documents.generated";
import { getClient } from "~/lib/apollo";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data, error } = await getClient().query({
    query: GetDashboardDocument,
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <CreateDashboardCTA />
      {!error && <Dashboard data={data.dashboard} />}
    </div>
  );
}
