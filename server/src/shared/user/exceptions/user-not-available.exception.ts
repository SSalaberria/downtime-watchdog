import { HttpException } from '@nestjs/common';

export class UserNotAvailableException extends HttpException {
  constructor(id: string) {
    super(`${id} is not available`, 404);
  }
}
