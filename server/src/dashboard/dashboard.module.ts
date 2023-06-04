import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackerModule } from 'src/tracker';

import { DashboardResolver } from './dashboard.resolver';
import { DashboardService } from './dashboard.service';
import { Dashboard, DashboardSchema } from './entities';

@Module({
  imports: [MongooseModule.forFeature([{ name: Dashboard.name, schema: DashboardSchema }]),
    TrackerModule,
  ],
  providers: [DashboardResolver, DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
