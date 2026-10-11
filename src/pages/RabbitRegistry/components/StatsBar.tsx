import type { Stats } from "../types";

interface Props {
  stats: Stats;
}

export default function StatsBar({ stats }: Props) {
  return (
    <div className="registry-stats">
      <div className="registry-stat-card total">
        <span className="registry-stat-value">{stats.total}</span>
        <span className="registry-stat-label">Всього</span>
      </div>
      <div className="registry-stat-card male">
        <span className="registry-stat-value">{stats.males}</span>
        <span className="registry-stat-label">Самців</span>
      </div>
      <div className="registry-stat-card female">
        <span className="registry-stat-value">{stats.females}</span>
        <span className="registry-stat-label">Самиць</span>
      </div>
      <div className="registry-stat-card young">
        <span className="registry-stat-value">{stats.youngTotal}</span>
        <span className="registry-stat-label">Молодняк</span>
        {stats.youngFromCages > 0 && (
          <span className="registry-stat-sub">
            в маточ.: {stats.youngFromCages}
          </span>
        )}
        {stats.youngFromPaddocks > 0 && (
          <span className="registry-stat-sub">
            З підлог.: {stats.youngFromPaddocks}
          </span>
        )}
      </div>
      {stats.paddockFemales > 0 && (
        <div className="registry-stat-card paddock">
          <span className="registry-stat-value">{stats.paddockFemales}</span>
          <span className="registry-stat-label">Підлогове</span>
          <span className="registry-stat-sub">
            ♀ самок: {stats.paddockFemales}
          </span>
        </div>
      )}
      {stats.fatteningTotal > 0 && (
        <div className="registry-stat-card fattening">
          <span className="registry-stat-value">{stats.fatteningTotal}</span>
          <span className="registry-stat-label">Відгодівля</span>
          <span className="registry-stat-sub">
            {stats.fatteningMales > 0 && `♂ ${stats.fatteningMales} `}
            {stats.fatteningFemales > 0 && `♀ ${stats.fatteningFemales} `}
            {stats.fatteningUnknown > 0 && `? ${stats.fatteningUnknown}`}
          </span>
        </div>
      )}
      <div className="registry-stat-card quarantine">
        <span className="registry-stat-value">{stats.quarantineTotal}</span>
        <span className="registry-stat-label">Карантин</span>
        {stats.quarantineTotal > 0 && (
          <span className="registry-stat-sub">
            {stats.quarantineMales > 0 && `♂ ${stats.quarantineMales} `}
            {stats.quarantineFemales > 0 && `♀ ${stats.quarantineFemales} `}
            {stats.quarantineUnknown > 0 && `? ${stats.quarantineUnknown}`}
          </span>
        )}
      </div>
    </div>
  );
}
