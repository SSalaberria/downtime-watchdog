import mongoose from 'mongoose';

import type { TrackingLog } from './entities';
import { Status } from './tracker.interface';

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
    });

    // Move to the next 10-minute interval
    currentTime.setMinutes(currentTime.getMinutes() + 10);
  }

  return unknownLogs;
}
