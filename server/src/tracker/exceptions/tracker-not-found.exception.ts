import { NotFoundException } from '@nestjs/common';

export class TrackerNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Tracker with id ${id} not found`);
  }
}
