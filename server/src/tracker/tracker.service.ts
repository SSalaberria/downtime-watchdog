/* eslint-disable @typescript-eslint/member-ordering */
import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import type { AxiosResponse } from 'axios';
import { CronJob } from 'cron';
import type mongoose from 'mongoose';
import type { Model } from 'mongoose';

import type { CreateTrackerInput } from './dto/create-tracker.input';
import { TrackedErrorEvent } from './dto/tracked-error.event';
import { Tracker, TrackerDocument, TrackingLog, TrackingLogDocument } from './entities';
import { TrackerNotFoundException } from './exceptions';
import { CRON_JOB_PATTERN } from './tracker.consts';
import { Status } from './tracker.interface';
import { getUnknownLogs } from './tracker.utils';

@Injectable()
export class TrackerService implements OnApplicationBootstrap, OnModuleDestroy {
  public constructor(
    @InjectModel(Tracker.name) private readonly trackerModel: Model<TrackerDocument>,
    @InjectModel(TrackingLog.name) private readonly trackingLogModel: Model<TrackingLogDocument>,
    private eventEmitter: EventEmitter2,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly httpService: HttpService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const trackers = await this.findAll();
    const unknownLogs: TrackingLog[] = [];

    for (const tracker of trackers) {
      const { _id: trackerId } = tracker;

      const lastLog = await this.trackingLogModel.findOne({ tracker: trackerId }).sort({ createdAt: -1 });

      unknownLogs.push(...getUnknownLogs(lastLog));

      this.activateTracker(tracker);
    }

    await this.trackingLogModel.insertMany(unknownLogs);
  }

  async onModuleDestroy(): Promise<void> {
    const trackers = await this.findAll();

    for (const tracker of trackers) {
      this.deactivateTracker(tracker);
    }
  }

  activateTracker(tracker: Tracker): void {
    const { _id: trackerId, website } = tracker;

    const job = new CronJob(CRON_JOB_PATTERN, () => {
      const createdAt = new Date();

      this.httpService.get(website).subscribe({
        next: (res) => {
          const { responseTime, statusText } = res as AxiosResponse & { responseTime: number };

          void this.trackingLogModel.create({ tracker: trackerId, status: Status.UP, responseTime, createdAt, response: statusText });
        },
        error: ({ responseTime, code }) => {
          void this.trackingLogModel.create({
            tracker: trackerId,
            status: Status.DOWN,
            responseTime,
            createdAt,
            response: code,
          });

          this.eventEmitter.emit(TrackedErrorEvent.name, new TrackedErrorEvent(trackerId, tracker.website));
        },
      });
    });

    this.schedulerRegistry.addCronJob(String(trackerId), job);

    job.start();
  }

  deactivateTracker(tracker: Tracker): void {
    const { _id: trackerId } = tracker;

    const job = this.schedulerRegistry.getCronJob(String(trackerId));

    job.stop();
  }

  async create(createTrackerInput: CreateTrackerInput): Promise<TrackerDocument> {
    const newTracker = await this.trackerModel.create(createTrackerInput);

    this.activateTracker(newTracker);

    return newTracker.save();
  }

  async findOne(id: mongoose.Schema.Types.ObjectId): Promise<Tracker> {
    const tracker = await this.trackerModel.findById(id).exec();

    if (!tracker) {
      throw new TrackerNotFoundException(String(id));
    }

    return tracker;
  }

  async findByWebsite(website: string): Promise<Tracker | null> {
    return this.trackerModel.findOne({ website }).exec();
  }

  async findAll(): Promise<Tracker[]> {
    return this.trackerModel.find().exec();
  }

  async remove(id: mongoose.Schema.Types.ObjectId): Promise<Tracker> {
    const tracker = await this.findOne(id);

    await this.trackerModel.deleteOne({ _id: tracker._id }).exec();
    await this.deleteLogs(tracker._id);

    this.deactivateTracker(tracker);

    return tracker;
  }

  async deleteLogs(id: mongoose.Schema.Types.ObjectId): Promise<void> {
    await this.trackingLogModel.deleteMany({ tracker: id }).exec();
  }
}
