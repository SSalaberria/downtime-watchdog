import { TrackingLog } from "~/common/types.generated";

export const formatResponseTime = (responseTime: number) => {
  if (responseTime < 1000) {
    return `${Math.floor(responseTime)} ms`;
  }

  return `${(responseTime / 1000).toFixed(1)} s`;
};

export const sortLogsByDate = (logs: Omit<TrackingLog, "tracker">[]) => {
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

        const logsByHour = filteredLogs.reduce((acc, log) => {
          const hour = new Date(log.createdAt).getUTCHours();

          if (!acc[hour]) {
            acc[hour] = [];
          }

          acc[hour]!.push(log);

          return acc;
        }, {} as Record<number, Array<Omit<TrackingLog, "tracker">>>);

        return logsByHour;
      })(),
    }))
    .reverse();
};
