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
    <div className="weighing-empty-state">
      <div className="weighing-empty-illustration">{icon}</div>
      <h3 className="weighing-empty-title">{title}</h3>
      <p className="weighing-empty-desc">{description}</p>
    </div>
  );
}
