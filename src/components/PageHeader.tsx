type PageHeaderProps = {
  label: string;
  title: string;
};

export default function PageHeader({
  label,
  title,
}: PageHeaderProps) {
  return (
    <div>
      <p className="uppercase tracking-[0.3em] text-gray-400 text-sm">
        {label}
      </p>

      <h1 className="mt-3 text-5xl font-extralight tracking-tight">
        {title}
      </h1>
    </div>
  );
}