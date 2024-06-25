import { AvailabilityStatus, ResponseTimeStatus } from "~/common/types.generated";

const AVAILABILITY_COLOR = {
  [AvailabilityStatus.High]: "text-green-600",
  [AvailabilityStatus.Low]: "text-red-500",
  [AvailabilityStatus.Medium]: "text-yellow-500",
  [AvailabilityStatus.Unknown]: "text-gray-600",
};

const RESPONSE_TIME_COLOR = {
  [ResponseTimeStatus.High]: "text-red-500",
  [ResponseTimeStatus.Low]: "text-green-600",
  [ResponseTimeStatus.Medium]: "text-yellow-500",
};

export { AVAILABILITY_COLOR, RESPONSE_TIME_COLOR };
