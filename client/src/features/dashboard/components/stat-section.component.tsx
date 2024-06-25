export const StatSection = ({
  value,
  label,
  color,
}: {
  value: string;
  label?: string;
  color: string;
}) => (
  <div className="flex flex-col items-center">
    <span className={`text-2xl font-semibold ${color}`}>{value}</span>
    {label && <span className="text-xs font-light">{label}</span>}
  </div>
);
