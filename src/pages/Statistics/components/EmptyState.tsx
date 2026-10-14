export default function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="stats-empty-state">
      <div className="stats-empty-illustration">{icon}</div>
      <h3 className="stats-empty-title">{title}</h3>
      <p className="stats-empty-desc">{description}</p>
    </div>
  );
}
