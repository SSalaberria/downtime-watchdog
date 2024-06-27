"use client";

import { useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client";

import {
  DashboardFragment,
  GetDashboardDocument,
  GetUserDashboardDocument,
  RemoveTrackerDocument,
} from "../gql/documents.generated";

import { TrackerCard } from "./tracker-card.component";

interface DashboardProps {
  data: DashboardFragment | undefined;
  showActions?: boolean;
  loading?: boolean;
  stacked?: boolean;
}

export function Dashboard({ data, showActions, loading, stacked }: DashboardProps) {
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
            ...data!,
            trackers: data!.trackers.filter((tracker) => tracker._id !== trackerId),
          },
        },
      });
    },
    [removeTracker, data],
  );

  const stackedPosition = (i: number) => ({
    marginBottom: "-8rem",
    marginLeft: `${i}rem`,
    marginRight: `-${i}rem`,
  });

  return (
    <div className="flex w-full gap-2 p-2 text-center">
      {!loading && data?.trackers.length === 0 ? (
        <p className="w-full">No trackers have been added to this dashboard yet.</p>
      ) : (
        <div
          className="grid w-full gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
          }}
        >
          {!loading &&
            data?.trackers.map((tracker, i) => (
              <TrackerCard
                key={tracker._id}
                data={tracker}
                {...(stacked && {
                  style: {
                    ...stackedPosition(i),
                  },
                  className: "mobile:!mx-0",
                })}
                {...(showActions && { onRemove: handleRemoveTracker })}
              />
            ))}

          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className=" h-60 animate-pulse rounded-lg bg-accent-1"
                {...(stacked && {
                  style: {
                    ...stackedPosition(i),
                  },
                })}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export function DashboardCC({
  ...props
}: Omit<DashboardProps, "loading" | "data"> & { dashboardId?: string }) {
  const { data, loading, error } = useQuery(GetDashboardDocument, {
    variables: { _id: props.dashboardId },
  });

  if (error) {
    return <p>An error has occurred trying to load the dashboard.</p>;
  }

  return <Dashboard data={data?.dashboard} loading={loading} {...props} />;
}
