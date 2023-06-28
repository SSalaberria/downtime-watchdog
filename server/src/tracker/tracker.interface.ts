export enum Status {
  UP = 'UP',
  DOWN = 'DOWN',
  UNKNOWN = 'UNKNOWN', // UNKNOWN is meant for logs where the tracker missed that timeframe
  UNTRACKED = 'UNTRACKED', // UNTRACKED is meant for logs where there is no data for that timeframe
}

export enum AvailabilityStatus {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  UNKNOWN = 'UNKNOWN',
}

export enum ResponseTimeStatus {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}
