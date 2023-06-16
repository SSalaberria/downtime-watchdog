import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Tracker, TrackerSchema, TrackingLog, TrackingLogSchema } from './entities';
import { TrackerResolver } from './tracker.resolver';
import { TrackerService } from './tracker.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tracker.name, schema: TrackerSchema }, { name: TrackingLog.name, schema: TrackingLogSchema }]),
    HttpModule,
  ],
  providers: [TrackerResolver, TrackerService],
  exports: [TrackerService],
})
export class TrackerModule {}
