const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton skeleton-circle" />
      <div className="skeleton skeleton-line skeleton-line--title" />
      <div className="skeleton skeleton-line skeleton-line--badge" />
    </div>
    <div className="skeleton skeleton-line skeleton-line--short" />
    <div className="skeleton skeleton-line skeleton-line--medium" />
    <div className="skeleton skeleton-line skeleton-line--long" />
    <div className="skeleton-actions">
      <div className="skeleton skeleton-btn" />
      <div className="skeleton skeleton-btn" />
    </div>
  </div>
);

export default SkeletonCard;
