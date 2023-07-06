import { memo, useMemo } from "react";

import { Status, TrackingLog } from "~/common/types.generated";

import { formatResponseTime } from "../common";

interface TrackingGraphProps {
  logsByDate: {
    date: string;
    logs: Record<number, Omit<TrackingLog, "tracker">[]>;
  }[];
  showAll?: boolean;
}

const STATUS_COLORS = {
  [Status.Up]: "bg-green-600",
  [Status.Down]: "bg-red-500",
  [Status.Unknown]: "bg-gray-500",
  [Status.Untracked]: "bg-gray-800",
};

function getHourlyStatus(logs: Omit<TrackingLog, "tracker">[]) {
  const statuses = logs.map((log) => log.status);

  if (statuses.includes(Status.Down)) {
    return Status.Down;
  }

  if (statuses.includes(Status.Up)) {
    return Status.Up;
  }

  if (statuses.includes(Status.Unknown)) {
    return Status.Unknown;
  }

  return Status.Untracked;
}

const LogBar = memo(function LogBar({ logs }: { logs: Array<Omit<TrackingLog, "tracker">> }) {
  const data = useMemo(() => {
    const status = getHourlyStatus(logs);
    const trackedLogs = logs.filter((log) => log.responseTime);
    const responseTime =
      trackedLogs.reduce((acc, log) => acc + (log?.responseTime || 0), 0) / trackedLogs.length;

    const createdAt =
      status === Status.Down
        ? logs.find((log) => log.status === Status.Down)?.createdAt
        : logs[0]!.createdAt;

    return {
      status,
      color: STATUS_COLORS[status],
      createdAt,
      responseTime,
    };
  }, [logs]);

  return (
    <div className="group/item relative flex bg-green-200">
      <span
        className={`${data.color} h-0.5 w-2 transition-transform group-hover/item:scale-150 group-hover/item:bg-white`}
      />
      <div className="invisible absolute left-4 z-50 inline-block rounded-2xl border border-accent-1 bg-background-primary p-2 group-hover/item:visible">
        <div className=" min-w-max">
          <div className={`mr-2 inline-block h-3 w-3 rounded-[50%] ${data.color}`} />
          <p className="inline">
            {`${Intl.DateTimeFormat(undefined, {
              hour: "numeric",
              minute: "numeric",
              timeZone: "UTC",
            }).format(new Date(data.createdAt))} UTC`}
          </p>
        </div>
        <p className=" text-sm italic">
          {data?.responseTime ? (
            formatResponseTime(data.responseTime)
          ) : (
            <span className=" text-gray-600">Untracked</span>
          )}
        </p>
      </div>
    </div>
  );
});

export function TrackingGraph({ logsByDate, showAll }: TrackingGraphProps) {
  return (
    <div className="flex w-full justify-center gap-0.5">
      {logsByDate.map((col) => (
        <div key={col.date} className="group/column flex ">
          <div className="flex w-2 flex-col-reverse gap-0.5">
            {Object.entries(col.logs).map(([hour, hourlyLogs]) => {
              if (showAll) {
                return hourlyLogs.map((log) => <LogBar key={log._id} logs={[log]} />);
              }

              return <LogBar key={hour} logs={hourlyLogs} />;
            })}
          </div>
          {Object.entries(col.logs).length > 0 && (
            <div className="invisible absolute bottom-0 -ml-2 text-sm group-hover/column:visible">
              <span>
                {`${Intl.DateTimeFormat(undefined, {
                  day: "numeric",
                  month: "numeric",
                  timeZone: "UTC",
                }).format(new Date(col.date))}`}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
