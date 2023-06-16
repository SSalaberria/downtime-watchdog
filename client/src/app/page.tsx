import { LoginForm } from "~/features/auth";
import { Dashboard } from "~/features/dashboard";
import { GetDashboardDocument } from "~/features/dashboard/gql/documents.generated";
import { getClient } from "~/lib/apollo";

export default async function HomePage() {
  const { data } = await getClient().query({
    query: GetDashboardDocument,
    variables: { sinceDate: new Date() },
  });

  return (
    <main className="flex-col items-center justify-center">
      <Dashboard data={data.dashboard} />
      <LoginForm />
    </main>
  );
}
