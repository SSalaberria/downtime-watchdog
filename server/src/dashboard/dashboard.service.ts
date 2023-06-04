import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, Types } from 'mongoose';
import type mongoose from 'mongoose';
import { TrackerService } from 'src/tracker';

import type { AddTrackerInput } from './dto';
import type { CreateDashboardInput } from './dto/create-dashboard.input';
import { Dashboard, DashboardDocument } from './entities';
import { DashboardNotFoundException } from './exceptions/DashboardNotFound.exception';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Dashboard.name) private readonly dashboardModel: Model<DashboardDocument>,
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

  async findByOwner(ownerId: Types.ObjectId): Promise<Dashboard> {
    const dashboard = await this.dashboardModel.findOne({ owner: ownerId }).exec();

    if (!dashboard) {
      throw new DashboardNotFoundException(`owner ID ${String(ownerId)}`);
    }

    return dashboard;
  }

  async addTracker(dashboardId: mongoose.Schema.Types.ObjectId, addTrackerInput: AddTrackerInput): Promise<Dashboard> {
    const newTracker = await this.trackers.create(addTrackerInput);

    const dashboard = await this.dashboardModel.findById(dashboardId).exec();

    if (!dashboard) {
      throw new DashboardNotFoundException(`dashboard ID ${String(dashboardId)}`);
    }

    dashboard.trackers.push(newTracker._id);

    return dashboard.save();
  }
}
