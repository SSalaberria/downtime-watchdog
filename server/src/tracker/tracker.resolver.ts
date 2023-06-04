import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import mongoose from 'mongoose';

import { CreateTrackerInput } from './dto/create-tracker.input';
import { Tracker } from './entities/tracker.entity';
import { TrackerService } from './tracker.service';

@Resolver(() => Tracker)
export class TrackerResolver {
  constructor(private readonly trackerService: TrackerService) {}

  @Mutation(() => Tracker)
  async createTracker(@Args('createTrackerInput') createTrackerInput: CreateTrackerInput): Promise<Tracker> {
    return this.trackerService.create(createTrackerInput);
  }

  @Query(() => [Tracker], { name: 'tracker' })
  async findAll(): Promise<Tracker[]> {
    return this.trackerService.findAll();
  }

  @Query(() => Tracker, { name: 'tracker' })
  async findOne(@Args('_id', { type: () => String }) id: mongoose.Schema.Types.ObjectId): Promise<Tracker> {
    return this.trackerService.findOne(id);
  }

  @Mutation(() => Tracker)
  async removeTracker(@Args('_id', { type: () => String }) id: mongoose.Schema.Types.ObjectId): Promise<Tracker> {
    return this.trackerService.remove(id);
  }
}
