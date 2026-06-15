type MetricCardProps = {
  title: string;
  value: string;
};

export default function MetricCard({
  title,
  value,
}: MetricCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-400">
        {title}
      </p>

      <h3 className="mt-3 text-4xl font-light">
        {value}
      </h3>
    </div>
  );
}