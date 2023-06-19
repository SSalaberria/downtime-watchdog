"use client";

import { useQuery } from "@apollo/client";

import { Dashboard } from "~/features/dashboard";
import { GetUserDashboardDocument } from "~/features/dashboard/gql/documents.generated";

export function UserDashboard({}) {
  const { data } = useQuery(GetUserDashboardDocument);

  if (!data) return <div>loading</div>;

  return <Dashboard data={data.userDashboard} showActions={true} />;
}
