/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';

import { TrackingLog } from './tracking-log.entity';
import { AVAILABILITY_THRESHOLDS } from '../tracker.consts';
import { AvailabilityStatus, ResponseTimeStatus, Status } from '../tracker.interface';

export type TrackerDocument = HydratedDocument<Tracker>;

registerEnumType(AvailabilityStatus, {
  name: 'AvailabilityStatus',
  description: 'Availability status of the tracker',
});

registerEnumType(ResponseTimeStatus, {
  name: 'ResponseTimeStatus',
  description: 'Response time status of the tracker',
});

@ObjectType()
export class Availability {
  @Field(() => AvailabilityStatus, { description: 'Availability status of the tracked website' })
  status!: AvailabilityStatus;

  @Field(() => Number, { description: 'Availability threshold of the tracked website' })
  uptime!: number;

  @Field(() => Number, { description: 'Average response time of the tracked website', nullable: true })
  responseTime!: number;

  @Field(() => ResponseTimeStatus, { description: 'Response time status of the tracked website', nullable: true })
  responseTimeStatus!: ResponseTimeStatus;
}

@ObjectType()
@Schema({ timestamps: true, toObject: { virtuals: true } })
export class Tracker {
  @Field(() => String, { description: 'Unique identifier of the tracker' })
  _id!: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  @Field(() => String, { description: 'Website url to be tracked' })
  website!: string;

  @Field(() => [TrackingLog], { description: 'Tracking logs of the tracker' })
  trackingLogs!: TrackingLog[];

  @Field(() => Availability, { description: 'Availability of the tracker' })
  monthlyAvailability!: Availability;
}

const TrackerSchema = SchemaFactory.createForClass(Tracker);

TrackerSchema.virtual('trackingLogs', {
  ref: 'TrackingLog',
  localField: '_id',
  foreignField: 'tracker',
});

TrackerSchema.virtual('monthlyAvailability').get(async function (this: TrackerDocument) {
  const lastMonth = new Date();

  lastMonth.setDate(lastMonth.getDate() - 30);
  lastMonth.setHours(0, 0, 0, 0);

  await this.populate({
    path: 'trackingLogs',
    match: { createdAt: { $gt: lastMonth, $lt: new Date() } },
    options: { sort: { createdAt: -1 } },
  });

  const { trackingLogs } = this;

  if (!trackingLogs.length) return { uptime: 0, status: AvailabilityStatus.UNKNOWN, responseTime: null };

  const trackedLogs = trackingLogs.reduce<{
    upLogs: TrackingLog[];
    downLogs: TrackingLog[];
    trackedResponseTimes: {
      total: number;
      count: number;
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
      }

      return acc;
    },
    {
      upLogs: [],
      downLogs: [],
      trackedResponseTimes: {
        total: 0,
        count: 0,
      },
    },
  );

  const uptime = trackedLogs.upLogs.length / (trackedLogs.upLogs.length + trackedLogs.downLogs.length);
  const responseTime = trackedLogs.trackedResponseTimes.total / trackedLogs.trackedResponseTimes.count;

  const status = uptime < AVAILABILITY_THRESHOLDS.LOW ? AvailabilityStatus.LOW
    : uptime < AVAILABILITY_THRESHOLDS.MEDIUM ? AvailabilityStatus.MEDIUM
      : AvailabilityStatus.HIGH;

  const responseTimeStatus = responseTime < 1000 ? ResponseTimeStatus.LOW
    : responseTime < 3000 ? ResponseTimeStatus.MEDIUM
      : ResponseTimeStatus.HIGH;

  return { uptime, status, responseTime, responseTimeStatus };
});

export { TrackerSchema };
