"use client";

import { memo, useMemo } from "react";
import { useRouter } from "next/navigation";

import { AvailabilityStatus, ResponseTimeStatus } from "~/common/types.generated";
import { TrashIcon, ImageWithFallback } from "~/common/ui";

import { TrackerFragment } from "../gql/documents.generated";
import { formatResponseTime, sortLogsByDate } from "../common";

import { TrackingGraph } from "./tracking-graph.component";
import { StatSection } from "./stat-section.component";

interface TrackerProps {
  data: TrackerFragment;
  style?: React.CSSProperties;
  className?: string;
  onRemove?: (trackerId: string) => void;
}

const AVAILABILITY_COLOR = {
  [AvailabilityStatus.High]: "text-green-600",
  [AvailabilityStatus.Low]: "text-red-500",
  [AvailabilityStatus.Medium]: "text-yellow-500",
  [AvailabilityStatus.Unknown]: "text-gray-600",
};

const RESPONSE_TIME_COLOR = {
  [ResponseTimeStatus.High]: "text-red-500",
  [ResponseTimeStatus.Low]: "text-green-600",
  [ResponseTimeStatus.Medium]: "text-yellow-500",
};

export const TrackerCard = memo(function TrackerCard({
  data,
  onRemove,
  style,
  className,
}: TrackerProps) {
  const { push, prefetch } = useRouter();

  const logsByDate = useMemo(() => sortLogsByDate(data.trackingLogs), [data.trackingLogs]);

  const handleCardClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    push(`/dashboard/tracker/${data._id}`);
  };

  return (
    <div
      className={
        "card relative flex h-60 cursor-pointer flex-col p-6 transition-transform duration-300 hover:-translate-y-3 " +
        className
      }
      id="tracker-card"
      style={style}
      onClick={handleCardClick}
      onMouseEnter={() => {
        prefetch(`/dashboard/tracker/${data._id}`);
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <ImageWithFallback
          alt={`${data.website} favicon`}
          fallbackSrc="/images/loading.svg"
          height={32}
          src={`https://www.google.com/s2/favicons?domain=${data.website}&sz=32`}
          width={32}
        />

        <a className=" font-semibold text-white" href={data.website} target="_blank">
          {data.website}
        </a>
      </div>
      <div className="flex justify-center gap-2">
        <StatSection
          color={AVAILABILITY_COLOR[data.monthlyAvailability.status]}
          label="Monthly availability"
          value={`${(data.monthlyAvailability.uptime * 100).toFixed(1)} %`}
        />
        <StatSection
          color={
            RESPONSE_TIME_COLOR[
              data.monthlyAvailability.latency?.averageStatus || ResponseTimeStatus.High
            ]
          }
          label="Avg. latency"
          value={
            data.monthlyAvailability.latency?.average
              ? formatResponseTime(data.monthlyAvailability.latency.average)
              : "-"
          }
        />
      </div>
      <div className="mt-auto flex w-full items-center">
        {data.trackingLogs.length === 0 ? (
          <p className="mx-auto text-center text-gray-500">Not tracked yet.</p>
        ) : (
          <TrackingGraph logsByDate={logsByDate} />
        )}
      </div>

      <div className="absolute -top-3 right-0 flex flex-row-reverse">
        {onRemove && (
          <button
            className="group/btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(data._id);
            }}
          >
            <TrashIcon className="w-7 fill-gray-500 transition-all group-hover/btn:fill-red-600" />
          </button>
        )}
      </div>
    </div>
  );
});
