import { ImageWithFallback } from "~/common/ui/ImageWithFallback";
import { AvailabilityStatus, Status } from "~/common/types.generated";

import { TrackerFragment } from "../gql/documents.generated";

import { TrackingGraph } from "./tracking-graph.component";

interface TrackerProps {
  data: TrackerFragment;
}

const AVAILABILITY_COLOR = {
  [AvailabilityStatus.High]: "text-green-600",
  [AvailabilityStatus.Low]: "text-red-500",
  [AvailabilityStatus.Medium]: "text-yellow-500",
  [AvailabilityStatus.Unknown]: "text-gray-600",
};

export function TrackerCard({ data }: TrackerProps) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-accent-1 bg-background-secondary p-6">
      <div className="flex items-center gap-2">
        <ImageWithFallback
          alt={`${data.website} favicon`}
          fallbackSrc="/images/loading.svg"
          height={32}
          src={`https://www.google.com/s2/favicons?domain=${data.website}&sz=32`}
          width={32}
        />
        <h4 className=" font-semibold text-white">{data.website}</h4>
      </div>
      <div className="flex flex-col items-center">
        <span
          className={`text-2xl font-semibold ${
            AVAILABILITY_COLOR[data.monthlyAvailability.status]
          }`}
        >{`${(data.monthlyAvailability.uptime * 100).toFixed(1)} %`}</span>
        <span className="text-xs font-light">Monthly availability</span>
      </div>
      <div className="flex w-full items-center">
        <TrackingGraph logs={data.trackingLogs} />
        {data.trackingLogs.length === 0 && (
          <span className="mx-auto text-center text-gray-500">Not tracked yet.</span>
        )}
      </div>
    </div>
  );
}
