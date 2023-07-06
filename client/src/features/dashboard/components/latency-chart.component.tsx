import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import { TrackingLog } from "~/common/types.generated";
import { LoadingIcon } from "~/common/ui";

import { formatResponseTime } from "../common";

const ApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[232px] min-w-[300px] items-center justify-center">
      <LoadingIcon className="w-16 stroke-accent-2" />
    </div>
  ),
});

interface LatencyChartProps {
  logsByDate: {
    date: string;
    logs: Record<number, Omit<TrackingLog, "tracker">[]>;
  }[];
}

export function LatencyChart({ logsByDate }: LatencyChartProps) {
  const dailyAvgLatency = useMemo(() => {
    return logsByDate.map((dateLogs) => {
      const logs = Object.values(dateLogs.logs).flat();
      const trackedLogs = logs.filter((log) => log.responseTime);

      return {
        date: dateLogs.date,
        responseTime:
          trackedLogs.reduce((acc, log) => acc + (log?.responseTime || 0), 0) /
            trackedLogs.length || null,
      };
    });
  }, [logsByDate]);

  const options: ApexOptions = {
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    grid: {
      borderColor: "var(--accent-1)",
      yaxis: {
        lines: {
          // show: false,
        },
      },
    },
    colors: ["#16A34A"],
    xaxis: {
      categories: dailyAvgLatency.map((log) => log.date),
      labels: {
        show: false,
      },
      type: "datetime",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        color: "var(--accent-1)",
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value: number) => (value ? formatResponseTime(value) : "No data"),
      },
    },
  };

  return (
    <div className="h-full w-full">
      <ApexChart
        options={options}
        series={[
          {
            name: "Response time",
            data: dailyAvgLatency.map((log) => log.responseTime),
          },
        ]}
        type="line"
      />
    </div>
  );
}
