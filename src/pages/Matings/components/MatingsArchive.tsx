import { useState } from "react";
import type { Mating } from "../types";
import ArchivedMatingCard from "./ArchivedMatingCard";

interface Props {
  matings: Mating[];
  getRabbitName: (id: string | null) => string;
  onUnarchive: (id: string) => void;
}

/** Згортувана секція з архівними злучками. */
export default function MatingsArchive({
  matings,
  getRabbitName,
  onUnarchive,
}: Props) {
  const [showArchive, setShowArchive] = useState(false);

  return (
    <div className="matings-archive">
      <button
        className="matings-archive-toggle"
        onClick={() => setShowArchive(!showArchive)}
      >
        <span>🗄 Архів ({matings.length})</span>
        <span>{showArchive ? "▲" : "▼"}</span>
      </button>

      {showArchive && (
        <div className="matings-archive-list">
          {matings.length === 0 ? (
            <p className="matings-archive-empty">Архів порожній</p>
          ) : (
            matings.map((m) => (
              <ArchivedMatingCard
                key={m.id}
                mating={m}
                getRabbitName={getRabbitName}
                onUnarchive={onUnarchive}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
