"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client";

import {
  DashboardFragment,
  GetUserDashboardDocument,
  RemoveTrackerDocument,
} from "../gql/documents.generated";

import { TrackerCard } from "./tracker-card.component";

interface DashboardProps {
  data: DashboardFragment;
  showActions?: boolean;
}

export function Dashboard({ data, showActions }: DashboardProps) {
  const [removeTracker] = useMutation(RemoveTrackerDocument, {
    update(cache, { data }) {
      cache.updateQuery({ query: GetUserDashboardDocument }, (cacheData: any) => {
        return {
          ...cacheData,
          userDashboard: {
            ...cacheData?.userDashboard,
            trackers: data?.removeTrackerFromDashboard.trackers,
          },
        };
      });
    },
  });

  const handleRemoveTracker = useCallback(
    async (trackerId: string) => {
      await removeTracker({
        variables: { _id: trackerId },
        optimisticResponse: {
          removeTrackerFromDashboard: {
            __typename: "Dashboard",
            trackers: data.trackers.filter((tracker) => tracker._id !== trackerId),
          },
        },
      });
    },
    [removeTracker, data.trackers],
  );

  return (
    <div className="flex gap-2 p-2">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
        }}
      >
        {data.trackers.map((tracker) => (
          <TrackerCard
            key={tracker._id}
            data={tracker}
            {...(showActions && { onRemove: handleRemoveTracker })}
          />
        ))}
        {data.trackers.length === 0 && <p>No trackers have been added to this dashboard yet.</p>}
      </div>
    </div>
  );
}
