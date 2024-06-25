"use client";

import { useMemo } from "react";

import { ResponseTimeStatus } from "~/common/types.generated";
import {
  AVAILABILITY_COLOR,
  AvailabilityChart,
  LatencyChart,
  RESPONSE_TIME_COLOR,
  StatSection,
  TrackingGraph,
  formatResponseTime,
  sortLogsByDate,
} from "~/features/dashboard";

import { TrackerFragment } from "../gql/documents.generated";

export function TrackerDashboard({ tracker }: { tracker: TrackerFragment }) {
  const logsByDate = useMemo(() => sortLogsByDate(tracker.trackingLogs), [tracker.trackingLogs]);

  return (
    <div className="flex w-full flex-col-reverse items-center justify-center gap-8 md:flex-row md:items-start [&>*]:flex [&>*]:flex-col [&>*]:gap-4">
      {/* First col */}
      <div className="">
        <div className="card px-3 py-5">
          <h4 className="pb-4 text-xl text-primary">History</h4>
          <div className="">
            <TrackingGraph logsByDate={logsByDate} showAll={true} />
          </div>
        </div>
        <div className="card px-3 py-5">
          <h4 className="text-xl text-primary">Responses</h4>
          <div className="">
            {tracker.monthlyAvailability.responses.responseFrequencies.map(
              ({ response, count }) => {
                return (
                  <div key={response} className="flex w-full justify-between">
                    <p
                      className={`italic ${
                        response === "OK" ? AVAILABILITY_COLOR["HIGH"] : AVAILABILITY_COLOR["LOW"]
                      }`}
                    >
                      {response}
                    </p>
                    <p className="">
                      {((count / tracker.monthlyAvailability.responses.total) * 100).toFixed(1)} %
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* Second col */}
      <div className="w-full max-w-lg">
        <div className="card flex flex-col px-3 py-5">
          <div className="flex items-center justify-between">
            <h4 className=" text-xl text-primary">Availability</h4>
            <StatSection
              color={AVAILABILITY_COLOR[tracker.monthlyAvailability.status]}
              label="Monthly"
              value={`${(tracker.monthlyAvailability.uptime * 100).toFixed(1)} %`}
            />
          </div>
          <div className=" mx-auto">
            <AvailabilityChart logs={tracker.trackingLogs} />
          </div>
        </div>
        <div className="card flex flex-col px-3 py-5">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <h4 className=" text-xl text-primary">Latency</h4>
            <div className="flex gap-4">
              <StatSection
                color={
                  RESPONSE_TIME_COLOR[
                    tracker.monthlyAvailability.latency.minStatus || ResponseTimeStatus.High
                  ]
                }
                label="Min."
                value={
                  tracker.monthlyAvailability.latency.min?.responseTime
                    ? formatResponseTime(tracker.monthlyAvailability.latency.min.responseTime)
                    : "-"
                }
              />

              <StatSection
                color={
                  RESPONSE_TIME_COLOR[
                    tracker.monthlyAvailability.latency.maxStatus || ResponseTimeStatus.High
                  ]
                }
                label="Max."
                value={
                  tracker.monthlyAvailability.latency.max?.responseTime
                    ? formatResponseTime(tracker.monthlyAvailability.latency.max.responseTime)
                    : "-"
                }
              />

              <StatSection
                color={
                  RESPONSE_TIME_COLOR[
                    tracker.monthlyAvailability.latency.averageStatus || ResponseTimeStatus.High
                  ]
                }
                label="Average"
                value={
                  tracker.monthlyAvailability.latency.average
                    ? formatResponseTime(tracker.monthlyAvailability.latency.average)
                    : "-"
                }
              />
            </div>
          </div>
          <LatencyChart logsByDate={logsByDate} />
        </div>
      </div>
    </div>
  );
}
