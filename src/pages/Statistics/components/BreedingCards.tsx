import AccuracyCard from "./AccuracyCard";
import CageCard from "./CageCard";
import EmptyState from "./EmptyState";
import PairCard from "./PairCard";
import RabbitCard from "./RabbitCard";
import type {
  CageStat,
  FemaleAccuracyStat,
  PairStat,
  RabbitStat,
  StatsTab,
} from "../types";

// Списки карток для вкладок розведення: самки, самці, пари, клітки, точність.
// Для кожної вкладки — або картки, або порожній стан із підказкою.
export default function BreedingCards({
  activeTab,
  femaleStats,
  maleStats,
  pairStats,
  cageStats,
  accuracyStats,
  maxAlive,
}: {
  activeTab: StatsTab;
  femaleStats: RabbitStat[];
  maleStats: RabbitStat[];
  pairStats: PairStat[];
  cageStats: CageStat[];
  accuracyStats: FemaleAccuracyStat[];
  maxAlive: number;
}) {
  return (
    <>
      {activeTab === "females" &&
        (femaleStats.length === 0 ? (
          <EmptyState
            icon="♀"
            title="Даних по крольчихах ще немає"
            description="Додайте злучки в розділі Розведення — статистика з'явиться автоматично після першого окролу."
          />
        ) : (
          femaleStats.map((s, i) => (
            <RabbitCard key={s.id} stat={s} rank={i + 1} maxAlive={maxAlive} />
          ))
        ))}

      {activeTab === "males" &&
        (maleStats.length === 0 ? (
          <EmptyState
            icon="♂"
            title="Даних по кільцях ще немає"
            description="Статистика по самцях з'явиться після внесення злучок і окролів."
          />
        ) : (
          maleStats.map((s, i) => (
            <RabbitCard key={s.id} stat={s} rank={i + 1} maxAlive={maxAlive} />
          ))
        ))}

      {activeTab === "pairs" &&
        (pairStats.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="Даних по парах ще немає"
            description="Тут буде порівняння продуктивності кожної пари коєць × крольчиха."
          />
        ) : (
          pairStats.map((s, i) => (
            <PairCard
              key={`${s.maleId}_${s.femaleId}`}
              stat={s}
              rank={i + 1}
              maxAlive={maxAlive}
            />
          ))
        ))}

      {activeTab === "cages" &&
        (cageStats.length === 0 ? (
          <EmptyState
            icon="🏠"
            title="Даних по клітках ще немає"
            description="Вкажіть номери кліток при додаванні злучок — тоді тут з'явиться статистика по кожній клітці."
          />
        ) : (
          cageStats.map((s, i) => (
            <CageCard key={s.cage} stat={s} rank={i + 1} maxAlive={maxAlive} />
          ))
        ))}

      {activeTab === "accuracy" &&
        (accuracyStats.length === 0 ? (
          <EmptyState
            icon="🗓"
            title="Даних точності окролу ще немає"
            description="Точність рахується лише для окролів де заповнені обидва поля — «Очікуваний окріл» і «Дата окролу». Заповнюй їх в розділі Розведення."
          />
        ) : (
          accuracyStats.map((s, i) => (
            <AccuracyCard key={s.femaleId} stat={s} rank={i + 1} />
          ))
        ))}
    </>
  );
}
