import { calcAgeDays, calcAgeLabel } from "../../../utils/calcAge";
import type { Rabbit } from "../types";

interface Props {
  rabbit: Rabbit;
  thumbUrl?: string;
  onOpenPhoto: () => void;
  onEdit: () => void;
  onArchive: () => void;
}

export default function RabbitCard({
  rabbit,
  thumbUrl,
  onOpenPhoto,
  onEdit,
  onArchive,
}: Props) {
  return (
    <div className="rabbit-card">
      <div className="rabbit-card-header">
        <span className="rabbit-gender">
          {rabbit.gender === "female" ? "♀" : "♂"}
        </span>
        <h3>{rabbit.name}</h3>
        {rabbit.cage_number && (
          <span className="rabbit-cage">
            Клітка {rabbit.cage_number}
          </span>
        )}
      </div>
      {/* Додано: мініатюра племінного кролика, по кліку — повне фото.
          Показується лише коли посилання вже отримане. */}
      {rabbit.photo_path && thumbUrl && (
        <button
          type="button"
          className="rabbit-photo-btn"
          onClick={onOpenPhoto}
          aria-label={`Відкрити фото: ${rabbit.name}`}
        >
          <img
            className="rabbit-photo"
            src={thumbUrl}
            alt=""
            width={400}
            height={300}
            loading="lazy"
          />
        </button>
      )}
      <div className="rabbit-card-body">
        {rabbit.breed && (
          <p>
            <strong>Порода:</strong> {rabbit.breed}
          </p>
        )}
        {rabbit.birth_date && (
          <>
            <p>
              <strong>Нар.:</strong>{" "}
              {new Date(rabbit.birth_date).toLocaleDateString("uk-UA")}
            </p>
            <p className="rabbit-age">
              Вік: {calcAgeLabel(rabbit.birth_date)}
            </p>
          </>
        )}
        {rabbit.notes && <p className="rabbit-notes">{rabbit.notes}</p>}
      </div>
      {rabbit.birth_date &&
        (() => {
          const days = calcAgeDays(rabbit.birth_date);
          const breedingLimitDays = 3 * 365;
          const percent = Math.min(
            100,
            Math.round((days / breedingLimitDays) * 100),
          );

          return (
            <div className="rabbit-breeding-progress-track">
              <div
                className="rabbit-breeding-progress-fill"
                style={{
                  width: `${percent}%`,
                  backgroundColor: `hsl(${100 - percent}, 70%, 40%)`,
                }}
              />
            </div>
          );
        })()}
      <div className="rabbit-card-actions">
        <button
          className="rabbit-edit-btn"
          onClick={onEdit}
        >
          Редагувати
        </button>
        <button
          className="rabbit-archive-btn"
          onClick={onArchive}
        >
          Архівувати
        </button>
      </div>
    </div>
  );
}
