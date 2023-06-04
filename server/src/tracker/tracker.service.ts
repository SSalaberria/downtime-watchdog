import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type mongoose from 'mongoose';

import type { CreateTrackerInput } from './dto/create-tracker.input';
import { Tracker, TrackerDocument } from './entities';
import { TrackerNotFoundException } from './exceptions';

@Injectable()
export class TrackerService {
  public constructor(@InjectModel(Tracker.name) private readonly trackerModel: Model<TrackerDocument>) {}

  async create(createTrackerInput: CreateTrackerInput): Promise<TrackerDocument> {
    const newTracker = await this.trackerModel.create(createTrackerInput);

    return newTracker.save();
  }

  async findOne(id: mongoose.Schema.Types.ObjectId): Promise<Tracker> {
    const tracker = await this.trackerModel.findById(id).exec();

    if (!tracker) {
      throw new TrackerNotFoundException(String(id));
    }

    return tracker;
  }

  async findAll(): Promise<Tracker[]> {
    return this.trackerModel.find().exec();
  }

  async remove(id: mongoose.Schema.Types.ObjectId): Promise<Tracker> {
    const tracker = await this.findOne(id);

    await this.trackerModel.deleteOne({ _id: tracker._id }).exec();

    return tracker;
  }
}
