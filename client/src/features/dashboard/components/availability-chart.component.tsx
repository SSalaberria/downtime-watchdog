"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { memo, useMemo } from "react";

import { Status, TrackingLog } from "~/common/types.generated";
import { LoadingIcon } from "~/common/ui";

const ApexChart = dynamic(async () => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[232px] items-center justify-center">
      <LoadingIcon className="w-16 stroke-accent-2" />
    </div>
  ),
});

interface AvailabilityChartProps {
  logs: Array<Omit<TrackingLog, "tracker">>;
}

export const AvailabilityChart = memo(function AvailabilityChart({ logs }: AvailabilityChartProps) {
  const filteredLogsCount = useMemo(() => {
    return logs.reduce(
      (acc, log) => {
        if (log.status === Status.Up) {
          acc[Status.Up] += 1;
        }
        if (log.status === Status.Down) {
          acc[Status.Down] += 1;
        }
        if (log.status === Status.Unknown) {
          acc[Status.Unknown] += 1;
        }

        return acc;
      },
      {
        [Status.Up]: 0,
        [Status.Down]: 0,
        [Status.Unknown]: 0,
      },
    );
  }, [logs]);

  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          labels: {
            show: true,
            total: {
              color: "pink",
            },
            value: {
              color: "var(--font)",
            },
            name: {
              formatter(val) {
                return val.charAt(0) + val.toLowerCase().slice(1);
              },
            },
          },
        },
      },
    },
    noData: {
      text: "No data available",
      style: {
        color: "white",
      },
    },
    labels: [Status.Up, Status.Down, "Untracked"],
    colors: ["#16A34A", "#EF4444", "#6B7280"],
    stroke: {
      show: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  };

  return (
    <div className="w-full">
      <ApexChart options={options} series={Object.values(filteredLogsCount)} type="donut" />
    </div>
  );
});
