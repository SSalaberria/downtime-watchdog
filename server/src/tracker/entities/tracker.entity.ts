/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';

import { TrackingLog } from './tracking-log.entity';
import { AVAILABILITY_THRESHOLDS } from '../tracker.consts';
import { AvailabilityStatus, ResponseTimeStatus } from '../tracker.interface';
import { getResponseTimeStatus, processLogs } from '../tracker.utils';

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
export class Latency {
  @Field(() => Number, { description: 'Average response time of the tracked website', nullable: true })
  average!: number;

  @Field(() => ResponseTimeStatus, { description: 'Response time status of the tracked website', nullable: true })
  averageStatus!: ResponseTimeStatus;

  @Field(() => TrackingLog, { description: 'Tracker log with the minimum response time of the tracked website', nullable: true })
  min!: TrackingLog | null;

  @Field(() => ResponseTimeStatus, { description: 'Min. Response time status of the tracked website', nullable: true })
  minStatus!: ResponseTimeStatus;

  @Field(() => TrackingLog, { description: 'Tracking log with the maximum response time of the tracked website', nullable: true })
  max!: TrackingLog | null;

  @Field(() => ResponseTimeStatus, { description: 'Max. Response time status of the tracked website', nullable: true })
  maxStatus!: ResponseTimeStatus;
}

@ObjectType()
export class ResponseFrequency {
  @Field(() => Number, { description: 'Number of logs with given response' })
  count!: number;

  @Field(() => String, { description: 'Response of the logged request' })
  response!: string;
}

@ObjectType()
export class Responses {
  @Field(() => Number, { description: 'Total count of responses' })
  total!: number;

  @Field(() => [ResponseFrequency], { description: 'Response frequencies of the tracked website' })
  responseFrequencies!: ResponseFrequency[];
}

@ObjectType()
export class Availability {
  @Field(() => AvailabilityStatus, { description: 'Availability status of the tracked website' })
  status!: AvailabilityStatus;

  @Field(() => Number, { description: 'Availability threshold of the tracked website' })
  uptime!: number;

  @Field(() => Latency, { description: 'Latency of the tracked website' })
  latency!: Latency;

  @Field(() => Responses, { description: 'Response frequencies of the tracked website' })
  responses!: Responses;
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

  const processedData = processLogs(trackingLogs);

  const uptime = processedData.upLogs.length / (processedData.upLogs.length + processedData.downLogs.length);
  const responseTime = processedData.trackedResponseTimes.total / processedData.trackedResponseTimes.count;

  const status = uptime < AVAILABILITY_THRESHOLDS.LOW
    ? AvailabilityStatus.LOW
    : uptime < AVAILABILITY_THRESHOLDS.MEDIUM
      ? AvailabilityStatus.MEDIUM
      : AvailabilityStatus.HIGH;

  const latency = {
    average: responseTime,
    averageStatus: getResponseTimeStatus(responseTime),
    min: processedData.trackedResponseTimes.min,
    minStatus: getResponseTimeStatus(processedData.trackedResponseTimes.min?.responseTime ?? 0),
    max: processedData.trackedResponseTimes.max,
    maxStatus: getResponseTimeStatus(processedData.trackedResponseTimes.max?.responseTime ?? 0),
  };

  const responses = {
    total: Object.values(processedData.responses).reduce((acc, curr) => acc + curr, 0),
    responseFrequencies: Object.entries(processedData.responses)
      .map(([response, count]) => ({ response, count }))
      .sort((a, b) => b.count - a.count),
  };

  return { uptime, status, responseTime, latency, responses };
});

export { TrackerSchema };
