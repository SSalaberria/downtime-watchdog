import type { User } from 'src/shared/user';

export class UserRegisteredEvent {
  constructor(public readonly user: User, public readonly token: string) {}
}
