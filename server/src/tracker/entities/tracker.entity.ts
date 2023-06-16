/* eslint-disable no-nested-ternary */
/* eslint-disable max-classes-per-file */
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';

import { TrackingLog } from './tracking-log.entity';
import { AVAILABILITY_THRESHOLDS } from '../tracker.consts';
import { AvailabilityStatus, Status } from '../tracker.interface';

export type TrackerDocument = HydratedDocument<Tracker>;

registerEnumType(AvailabilityStatus, {
  name: 'AvailabilityStatus',
  description: 'Availability status of the tracker',
});

@ObjectType()
export class Availability {
  @Field(() => AvailabilityStatus, { description: 'Availability status of the tracker' })
  status!: AvailabilityStatus;

  @Field(() => Number, { description: 'Availability threshold of the tracker' })
  uptime!: number;
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

  if (!trackingLogs.length) return { uptime: 0, status: AvailabilityStatus.UNKNOWN };

  const uptimeLogs = trackingLogs.filter((log) => log.status === Status.UP || log.status === Status.UNKNOWN);

  const uptime = uptimeLogs.length / trackingLogs.length;

  const status = uptime < AVAILABILITY_THRESHOLDS.LOW ? AvailabilityStatus.LOW
    : uptime < AVAILABILITY_THRESHOLDS.MEDIUM ? AvailabilityStatus.MEDIUM
      : AvailabilityStatus.HIGH;

  return { uptime, status };
});

export { TrackerSchema };
