import { useMemo } from "react";

import { Status, TrackingLog } from "~/common/types.generated";

interface TrackingGraphProps {
  logs: Array<Omit<TrackingLog, "tracker">>;
}

// function fillArray<T>(arr: T[], value: T, length: number): T[] {
//   const filledArray: T[] = [...arr]; // Create a copy of the original array

//   while (filledArray.length < length) {
//     filledArray.push(value); // Add the given value to the array
//   }

//   return filledArray;
// }

export function TrackingGraph({ logs }: TrackingGraphProps) {
  const logsByDate = useMemo(() => {
    const dates: Array<string> = [];
    const date = new Date();

    for (let i = 0; i < 30; i++) {
      dates.push(date.toISOString());

      date.setDate(date.getDate() - 1);
    }

    return dates
      .map((date) => ({
        date,
        logs: (() => {
          const filteredLogs = logs.filter(
            (log) => log.createdAt.substring(0, 10) === date.substring(0, 10),
          );

          return filteredLogs;
        })(),
      }))
      .reverse();
  }, [logs]);

  return (
    <div className="flex w-full gap-0.5">
      {logsByDate.map((col) => (
        <div key={col.date} className="flex w-2 flex-col-reverse gap-0.5">
          {col.logs.map((log) => {
            const color =
              log.status === Status.Up
                ? "bg-green-600"
                : log.status === Status.Down
                ? "bg-red-500"
                : "bg-gray-500";

            return (
              <div key={log._id} className="group/item relative flex bg-green-200">
                <span
                  className={`${color} h-0.5 w-2 transition-transform group-hover/item:scale-150 group-hover/item:bg-white`}
                />
                <div className="invisible absolute left-4 z-10 w-36 rounded-2xl border border-accent-1 bg-background-primary p-2 group-hover/item:visible">
                  <div className={`mr-2 inline-block h-3 w-3 rounded-[50%] ${color}`} />
                  {`${Intl.DateTimeFormat(undefined, {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(log.createdAt))} UTC`}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
