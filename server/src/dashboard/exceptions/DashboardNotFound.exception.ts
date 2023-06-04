import { NotFoundException } from '@nestjs/common';

export class DashboardNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Dashboard with ${id} not found`);
  }
}
