import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import mongoose from 'mongoose';

import type { TrackingLog } from './entities';
import { Tracker, TrackerDocument } from './entities/tracker.entity';
import { TrackerService } from './tracker.service';

@Resolver(() => Tracker)
export class TrackerResolver {
  constructor(private readonly trackerService: TrackerService) {}

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

  @ResolveField()
  async trackingLogs(
    @Parent() tracker: TrackerDocument,
    @Args('sinceDate', { type: () => Date, nullable: true }) sinceDate: Date | null,
  ): Promise<TrackingLog[]> {
    const dateFilter = sinceDate
      || ((): Date => {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() - 30);
        defaultDate.setHours(0, 0, 0, 0);

        return defaultDate;
      })();

    await tracker.populate({
      path: 'trackingLogs',
      options: { sort: { createdAt: -1 } },
      match: { createdAt: { $gt: dateFilter } },
    });

    return tracker.trackingLogs.reverse();
  }
}
