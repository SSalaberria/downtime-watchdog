"use client";

import { DashboardFragment } from "../gql/documents.generated";

import { TrackerCard } from "./tracker-card.component";

interface DashboardProps {
  data: DashboardFragment;
}

export function Dashboard({ data }: DashboardProps) {
  return (
    <div className="flex gap-2 p-2">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
        }}
      >
        {data.trackers.map((tracker) => (
          <TrackerCard key={tracker._id} data={tracker} />
        ))}
        {data.trackers.length === 0 && <p>No trackers have been added to this dashboard yet.</p>}
      </div>
    </div>
  );
}
