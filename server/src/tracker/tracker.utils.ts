/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-nested-ternary */
import mongoose from 'mongoose';

import type { TrackingLog } from './entities';
import { RESPONSE_TIME_THRESHOLDS } from './tracker.consts';
import { ResponseTimeStatus, Status } from './tracker.interface';

export function getUnknownLogs(lastLog: TrackingLog | null): TrackingLog[] {
  const unknownLogs: TrackingLog[] = [];

  if (!lastLog) {
    return unknownLogs;
  }

  const endTime = new Date();

  // Iterate over the time range in 10-minute intervals
  const currentTime = new Date(lastLog.createdAt);
  currentTime.setMinutes(currentTime.getMinutes() + 10);

  while (currentTime <= endTime) {
    // Create a new log with "status" set to "UNKNOWN"
    unknownLogs.push({
      status: Status.UNKNOWN,
      createdAt: new Date(currentTime),
      _id: new mongoose.Types.ObjectId(),
      tracker: lastLog.tracker,
      responseTime: null,
      response: null,
    });

    // Move to the next 10-minute interval
    currentTime.setMinutes(currentTime.getMinutes() + 10);
  }

  return unknownLogs;
}

export function processLogs(logs: TrackingLog[]) {
  return logs.reduce<{
    upLogs: TrackingLog[];
    downLogs: TrackingLog[];
    responses: Record<string, number>;
    trackedResponseTimes: {
      total: number;
      count: number;
      min: TrackingLog | null;
      max: TrackingLog | null;
    };
  }>(
    (acc, log) => {
      if (log.status === Status.UP) {
        acc.upLogs.push(log);
      }

      if (log.status === Status.DOWN) {
        acc.downLogs.push(log);
      }

      if (log.responseTime) {
        acc.trackedResponseTimes.total += log.responseTime;
        acc.trackedResponseTimes.count += 1;
        acc.trackedResponseTimes.min = acc.trackedResponseTimes.min?.responseTime
          ? acc.trackedResponseTimes.min.responseTime < log.responseTime
            ? acc.trackedResponseTimes.min
            : log
          : log;
        acc.trackedResponseTimes.max = acc.trackedResponseTimes.max?.responseTime
          ? acc.trackedResponseTimes.max.responseTime > log.responseTime
            ? acc.trackedResponseTimes.max
            : log
          : log;
      }

      if (log.response) {
        acc.responses[log.response] = acc.responses[log.response] ? acc.responses[log.response] + 1 : 1;
      }

      return acc;
    },
    {
      upLogs: [],
      downLogs: [],
      responses: {},
      trackedResponseTimes: {
        total: 0,
        count: 0,
        max: null,
        min: null,
      },
    },
  );
}

export function getResponseTimeStatus(responseTime: number): ResponseTimeStatus {
  return responseTime < RESPONSE_TIME_THRESHOLDS.LOW
    ? ResponseTimeStatus.LOW
    : responseTime < RESPONSE_TIME_THRESHOLDS.MEDIUM
      ? ResponseTimeStatus.MEDIUM
      : ResponseTimeStatus.HIGH;
}
