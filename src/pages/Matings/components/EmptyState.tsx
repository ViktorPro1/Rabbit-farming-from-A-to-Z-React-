/** Порожній стан: у користувача ще немає жодної злучки. */
export default function EmptyState() {
  return (
    <div className="matings-empty-state">
      <div className="matings-empty-illustration">🐇</div>
      <h3 className="matings-empty-title">Злучок ще немає</h3>
      <p className="matings-empty-desc">
        Додайте першу злучку — вкажіть кролика, крольчиху і дату. Система
        автоматично розрахує контрольну дату і нагадає про маточник.
      </p>
    </div>
  );
}
