"use client";

import { memo, useState } from "react";

import { ImageWithFallback } from "~/common/ui/ImageWithFallback";
import { AvailabilityStatus } from "~/common/types.generated";
import { ExpandIcon, TrashIcon, Dialog } from "~/common/ui";

import { TrackerFragment } from "../gql/documents.generated";

import { TrackingGraph } from "./tracking-graph.component";

interface TrackerProps {
  data: TrackerFragment;
  onRemove?: (trackerId: string) => void;
}

const AVAILABILITY_COLOR = {
  [AvailabilityStatus.High]: "text-green-600",
  [AvailabilityStatus.Low]: "text-red-500",
  [AvailabilityStatus.Medium]: "text-yellow-500",
  [AvailabilityStatus.Unknown]: "text-gray-600",
};

export const TrackerCard = memo(function TrackerCard({ data, onRemove }: TrackerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const title = (
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
  );

  return (
    <>
      <div className="relative flex h-60 flex-col rounded-lg border border-accent-1 bg-background-secondary p-6">
        {title}
        <div className="mt-2 flex flex-col items-center">
          <span
            className={`text-2xl font-semibold ${
              AVAILABILITY_COLOR[data.monthlyAvailability.status]
            }`}
          >{`${(data.monthlyAvailability.uptime * 100).toFixed(1)} %`}</span>
          <span className="text-xs font-light">Monthly availability</span>
        </div>
        <div className="mt-auto flex w-full items-center">
          {data.trackingLogs.length === 0 ? (
            <p className="mx-auto text-center text-gray-500">Not tracked yet.</p>
          ) : (
            <TrackingGraph logs={data.trackingLogs} />
          )}
        </div>

        <div className="absolute -top-3 right-0 flex flex-row-reverse">
          {onRemove && (
            <button className="group/btn" onClick={() => onRemove(data._id)}>
              <TrashIcon className="w-7 fill-gray-500 transition-all group-hover/btn:fill-red-600" />
            </button>
          )}
          <button className="group/btn" onClick={() => setIsOpen(true)}>
            <ExpandIcon className="w-5 stroke-gray-500 transition-all group-hover/btn:stroke-gray-400" />
          </button>
        </div>
      </div>
      {isOpen && (
        <Dialog onClose={() => setIsOpen(false)}>
          <div className=" self-center">{title}</div>
          <TrackingGraph logs={data.trackingLogs} showAll={true} />
        </Dialog>
      )}
    </>
  );
});
