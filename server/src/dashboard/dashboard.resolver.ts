import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import mongoose, { Types } from 'mongoose';
import { JwtAuthGuard, Payload } from 'src/auth';
import { ReqUser } from 'src/common';
import { User } from 'src/shared/user';

import { DashboardService } from './dashboard.service';
import { AddTrackerInput, CreateDashboardInput } from './dto';
import { Dashboard, DashboardDocument } from './entities/dashboard.entity';

@UseGuards(JwtAuthGuard)
@Resolver(() => Dashboard)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => Dashboard)
  async dashboard(@Args('_id', { type: () => String }) id: mongoose.Schema.Types.ObjectId): Promise<Dashboard> {
    return this.dashboardService.findOne(id);
  }

  @ResolveField()
  async owner(@Parent() dashboard: DashboardDocument): Promise<User | mongoose.Schema.Types.ObjectId> {
    await dashboard.populate({ path: 'owner', model: User.name });

    return dashboard.owner;
  }

  @Mutation(() => Dashboard)
  async createDashboard(@Args('createDashboardInput') createDashboardInput: CreateDashboardInput): Promise<Dashboard> {
    return this.dashboardService.create(createDashboardInput);
  }

  @Mutation(() => Dashboard)
  async addTrackerToDashboard(
    @Args('AddTrackerInput') addTrackerInput: AddTrackerInput,
     @ReqUser() user: Payload,
  ): Promise<Dashboard> {
    const dashboard = await this.dashboardService.findByOwner(new Types.ObjectId(user.id));

    return this.dashboardService.addTracker(dashboard._id, addTrackerInput);
  }
}
