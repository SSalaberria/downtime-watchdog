export const LoadingIcon = (props: any) => (
  <svg
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="50"
      cy="50"
      fill="none"
      r="35"
      strokeDasharray="164.93361431346415 56.97787143782138"
      strokeWidth="4"
    >
      <animateTransform
        attributeName="transform"
        dur="1.2s"
        keyTimes="0;1"
        repeatCount="indefinite"
        type="rotate"
        values="0 50 50;360 50 50"
      />
    </circle>
  </svg>
);
