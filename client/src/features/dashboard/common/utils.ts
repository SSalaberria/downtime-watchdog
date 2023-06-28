export const formatResponseTime = (responseTime: number) => {
  if (responseTime < 1000) {
    return `${Math.floor(responseTime)} ms`;
  }

  return `${(responseTime / 1000).toFixed(1)} s`;
};
