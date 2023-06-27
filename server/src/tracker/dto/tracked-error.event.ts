import type mongoose from 'mongoose';

export class TrackedErrorEvent {
  constructor(public readonly trackerId: mongoose.Schema.Types.ObjectId, public readonly website: string) {
  }

  public toString(): string {
    return JSON.stringify({
      trackerId: this.trackerId,
      website: this.website,
    });
  }
}
