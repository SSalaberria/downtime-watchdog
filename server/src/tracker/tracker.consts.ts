const CRON_JOB_PATTERN = '*/10 * * * *';

const AVAILABILITY_THRESHOLDS = {
  LOW: 0.5,
  MEDIUM: 0.8,
  HIGH: 0.9,
};

const RESPONSE_TIME_THRESHOLDS = {
  LOW: 1000,
  MEDIUM: 3000,
  HIGH: 5000,
};

export { CRON_JOB_PATTERN, AVAILABILITY_THRESHOLDS, RESPONSE_TIME_THRESHOLDS };
