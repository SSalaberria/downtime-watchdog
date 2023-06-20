import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import mongoose, { Types } from 'mongoose';
import { JwtAuthGuard, Payload } from 'src/auth';
import { ReqUser, Roles, RolesGuard } from 'src/common';
import { User } from 'src/shared/user';
import { Role } from 'src/shared/user/user.interface';
import { Tracker } from 'src/tracker';

import { DashboardService } from './dashboard.service';
import { AddTrackerInput, CreateDashboardInput } from './dto';
import { RemoveTrackerInput } from './dto/remove-tracker.input';
import { Dashboard, DashboardDocument } from './entities/dashboard.entity';

@Resolver(() => Dashboard)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => Dashboard)
  async dashboard(@Args('_id', { type: () => String, nullable: true }) id: mongoose.Schema.Types.ObjectId | null): Promise<Dashboard> {
    if (!id) {
      return this.dashboardService.findAdminDashboard();
    }

    return this.dashboardService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Dashboard)
  async userDashboard(@ReqUser() user: Payload): Promise<Dashboard> {
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    return this.dashboardService.findByOwner(new Types.ObjectId(user.id));
  }

  @ResolveField()
  async owner(@Parent() dashboard: DashboardDocument): Promise<User | mongoose.Schema.Types.ObjectId> {
    await dashboard.populate({ path: 'owner', model: User.name });

    return dashboard.owner;
  }

  @ResolveField()
  async trackers(@Parent() dashboard: DashboardDocument): Promise<Tracker[] | mongoose.Schema.Types.ObjectId[]> {
    await dashboard.populate({ path: 'trackers', model: Tracker.name });

    return dashboard.trackers;
  }

  @Mutation(() => Dashboard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createDashboard(@Args('createDashboardInput') createDashboardInput: CreateDashboardInput): Promise<Dashboard> {
    return this.dashboardService.create(createDashboardInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Dashboard)
  async addTrackerToDashboard(@Args('AddTrackerInput') addTrackerInput: AddTrackerInput, @ReqUser() user: Payload): Promise<Dashboard> {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    const dashboard = await this.dashboardService.findByOwner(new Types.ObjectId(user.id));

    return this.dashboardService.addTracker(dashboard._id, addTrackerInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Dashboard)
  async removeTrackerFromDashboard(
    @Args('RemoveTrackerInput') removeTrackerInput: RemoveTrackerInput,
    @ReqUser() user: Payload,
  ): Promise<Dashboard> {
    const dashboard = await this.dashboardService.findByOwner(new Types.ObjectId(user.id));

    return this.dashboardService.removeTracker(dashboard._id, removeTrackerInput.trackerId);
  }
}
