"use client";

import { useQuery } from "@apollo/client";
import toast from "react-hot-toast";

import { CopyIcon } from "~/common/ui";
import { Dashboard, TrackerInput } from "~/features/dashboard";
import { GetUserDashboardDocument } from "~/features/dashboard/gql/documents.generated";

export function UserDashboard({}) {
  const { data, loading } = useQuery(GetUserDashboardDocument);

  const handleCopy = () => {
    const url = window.location.href;

    navigator.clipboard.writeText(`${url}/${data?.userDashboard._id}`);

    toast("Copied link to this dashboard!", {
      icon: "📋",
      duration: 5000,
    });
  };

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="flex">
        <TrackerInput className=" w-full sm:w-72" disabled={loading} />
        <button
          className="group/btn"
          disabled={loading}
          title="Copy the link to this dashboard"
          onClick={handleCopy}
        >
          <CopyIcon className="w-8 stroke-gray-500 group-hover/btn:stroke-gray-400" />
        </button>
      </div>
      <Dashboard data={data?.userDashboard} loading={loading} showActions={true} />
    </div>
  );
}
