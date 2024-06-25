"use client";

import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Dashboard } from "~/features/dashboard";
import { GetDashboardDocument } from "~/features/dashboard/gql/documents.generated";

export default function DashboardPageContent({ dashboardId }: { dashboardId: string }) {
  const { data } = useSuspenseQuery(GetDashboardDocument, {
    variables: { _id: dashboardId },
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-medium text-white">{`${data.dashboard.owner.name}'s dashboard`}</h1>

      <Dashboard data={data.dashboard} />
    </div>
  );
}
