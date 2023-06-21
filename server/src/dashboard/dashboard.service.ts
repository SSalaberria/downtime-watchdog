import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, Types } from 'mongoose';
import type mongoose from 'mongoose';
import { Role, UserService } from 'src/shared/user';
import { TrackerService } from 'src/tracker';

import type { AddTrackerInput } from './dto';
import type { CreateDashboardInput } from './dto/create-dashboard.input';
import { Dashboard, DashboardDocument } from './entities';
import { DashboardNotFoundException } from './exceptions/DashboardNotFound.exception';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Dashboard.name) private readonly dashboardModel: Model<DashboardDocument>,
    @Inject(forwardRef(() => UserService)) private readonly users: UserService,
    private trackers: TrackerService,
  ) {}

  async create(createDashboardInput: CreateDashboardInput): Promise<Dashboard> {
    const newDashboard = await this.dashboardModel.create({ ...createDashboardInput });

    return newDashboard.save();
  }

  async findOne(id: mongoose.Schema.Types.ObjectId): Promise<Dashboard> {
    const dashboard = await this.dashboardModel.findById(id).exec();

    if (!dashboard) {
      throw new DashboardNotFoundException(`dashboard ID ${String(id)}`);
    }

    return dashboard;
  }

  async findByOwner(ownerId: Types.ObjectId | mongoose.Schema.Types.ObjectId): Promise<Dashboard> {
    const dashboard = await this.dashboardModel.findOne({ owner: ownerId }).exec();

    if (!dashboard) {
      throw new DashboardNotFoundException(`owner ID ${String(ownerId)}`);
    }

    return dashboard;
  }

  async findAdminDashboard(): Promise<Dashboard> {
    const admins = await this.users.findAllByRole(Role.ADMIN);

    return this.findByOwner(admins[0]?._id);
  }

  async addTracker(dashboardId: mongoose.Schema.Types.ObjectId, addTrackerInput: AddTrackerInput): Promise<Dashboard> {
    // eslint-disable-next-line prefer-const
    let [trackerToBeAdded, dashboard] = await Promise.all([
      this.trackers.findByWebsite(addTrackerInput.website),
      this.dashboardModel.findById(dashboardId).exec(),
    ]);

    if (!dashboard) {
      throw new DashboardNotFoundException(`dashboard ID ${String(dashboardId)}`);
    }

    if (!trackerToBeAdded) {
      trackerToBeAdded = await this.trackers.create(addTrackerInput);
    } else {
      const { _id: trackerId } = trackerToBeAdded;

      const trackerAlreadyAdded = dashboard.trackers.some((tracker) => String(tracker) === String(trackerId));

      if (trackerAlreadyAdded) {
        return dashboard;
      }
    }

    dashboard.trackers.push(trackerToBeAdded._id);

    return dashboard.save();
  }

  async removeTracker(dashboardId: mongoose.Schema.Types.ObjectId, trackerId: mongoose.Schema.Types.ObjectId): Promise<Dashboard> {
    const [dashboard, dashboards] = await Promise.all([
      this.dashboardModel.findById(dashboardId).exec(),
      this.dashboardModel.find().exec(),
    ]);

    if (!dashboard) {
      throw new DashboardNotFoundException(`dashboard ID ${String(dashboardId)}`);
    }

    dashboard.trackers = dashboard.trackers.filter((tracker) => String(tracker) !== String(trackerId));

    if (dashboards.filter((dash) => dash.trackers.some((tracker) => String(tracker) === String(trackerId))).length === 1) {
      await this.trackers.remove(trackerId);
    }

    return dashboard.save();
  }
}
