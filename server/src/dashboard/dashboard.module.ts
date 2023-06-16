import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/shared/user';
import { TrackerModule } from 'src/tracker';

import { DashboardResolver } from './dashboard.resolver';
import { DashboardService } from './dashboard.service';
import { Dashboard, DashboardSchema } from './entities';

@Module({
  imports: [MongooseModule.forFeature([{ name: Dashboard.name, schema: DashboardSchema }]),
    TrackerModule,
    forwardRef(() => (UserModule)),
  ],
  providers: [DashboardResolver, DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
