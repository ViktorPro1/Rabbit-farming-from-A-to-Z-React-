import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./Pedigree.css";

interface Props {
  session: Session;
}

interface RabbitLite {
  id: string;
  name: string;
  breed: string;
  gender: "male" | "female";
  birth_date: string;
  cage_number: string;
  mother_id: string | null;
  father_id: string | null;
}

type Role = "mother" | "father";

export default function Pedigree({ session }: Props) {
  const navigate = useNavigate();
  const [rabbits, setRabbits] = useState<RabbitLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [generations, setGenerations] = useState<3 | 4>(3);
  const [showInfo, setShowInfo] = useState(false);

  const loadData = useCallback(() => {
    supabase
      .from("rabbits")
      .select(
        "id, name, breed, gender, birth_date, cage_number, mother_id, father_id",
      )
      .eq("user_id", session.user.id)
      .order("name", { ascending: true })
      .then(({ data }) => {
        setRabbits(data || []);
        setLoading(false);
      });
  }, [session.user.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const rabbitsMap: Record<string, RabbitLite> = {};
  rabbits.forEach((r) => (rabbitsMap[r.id] = r));

  async function handleAssign(childId: string, role: Role, parentId: string) {
    const field = role === "father" ? "father_id" : "mother_id";
    await supabase
      .from("rabbits")
      .update({ [field]: parentId || null })
      .eq("id", childId);
    loadData();
  }

  const selectedRabbit = selectedId ? rabbitsMap[selectedId] : null;

  return (
    <div className="pedigree-page">
      <div className="pedigree-header">
        <button
          className="pedigree-back-btn"
          onClick={() => navigate("/registry")}
        >
          ← Мої кролики
        </button>
        <h1>🧬 Родовід</h1>
      </div>

      {loading ? (
        <p className="pedigree-loading">Завантаження...</p>
      ) : (
        <>
          <div className="pedigree-controls no-print">
            <select
              className="pedigree-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">— Оберіть кролика —</option>
              {rabbits.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.gender === "female" ? "♀" : "♂"} {r.name}
                  {r.cage_number ? ` (клітка ${r.cage_number})` : ""}
                </option>
              ))}
            </select>

            <div className="pedigree-gen-toggle">
              <button
                className={generations === 3 ? "active" : ""}
                onClick={() => setGenerations(3)}
              >
                3 покоління
              </button>
              <button
                className={generations === 4 ? "active" : ""}
                onClick={() => setGenerations(4)}
              >
                4 покоління
              </button>
            </div>
          </div>

          {!selectedRabbit ? (
            <div className="pedigree-empty-state">
              <div className="pedigree-empty-icon">🐇</div>
              <p>Оберіть кролика зі списку, щоб побачити його родовід.</p>
            </div>
          ) : (
            <div className="pedigree-tree-wrapper">
              <PedigreeNode
                rabbitId={selectedId}
                childId={null}
                role={null}
                generation={0}
                maxGen={generations - 1}
                rabbitsMap={rabbitsMap}
                rabbits={rabbits}
                onAssign={handleAssign}
              />
            </div>
          )}

          <div className="pedigree-info no-print">
            <button
              className="pedigree-info-toggle"
              onClick={() => setShowInfo(!showInfo)}
            >
              <span>📋 Як внести родовід</span>
              <span>{showInfo ? "▲" : "▼"}</span>
            </button>

            {showInfo && (
              <div className="pedigree-info-body">
                <p className="pedigree-info-text">
                  Родовід будується автоматично з даних реєстру — окремої форми
                  для внесення немає. Заповнюєш прямо в дереві.
                </p>
                <ol className="pedigree-info-list">
                  <li>Обери кролика зі списку вгорі сторінки.</li>
                  <li>
                    Там, де предок невідомий, замість картки з'явиться список з
                    написом «+ Батько невідомий» або «+ Мати невідома».
                  </li>
                  <li>
                    Обери потрібну тварину зі списку — запис збережеться одразу,
                    без окремої кнопки «Зберегти».
                  </li>
                  <li>
                    Дерево перемалюється: на місці порожньої клітинки з'явиться
                    картка з кличкою. Якщо в цього предка теж є свої батьки в
                    реєстрі — так само признач і їх.
                  </li>
                </ol>
                <div className="pedigree-info-note">
                  ℹ️ У списку для вибору батька/матері показуються лише кролики
                  відповідної статі з твого реєстру. Якщо предка немає в реєстрі
                  (куплений без документів) — клітинка лишається «Невідомо».
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface NodeProps {
  rabbitId: string | null;
  childId: string | null;
  role: Role | null;
  generation: number;
  maxGen: number;
  rabbitsMap: Record<string, RabbitLite>;
  rabbits: RabbitLite[];
  onAssign: (childId: string, role: Role, parentId: string) => void;
}

function PedigreeNode({
  rabbitId,
  childId,
  role,
  generation,
  maxGen,
  rabbitsMap,
  rabbits,
  onAssign,
}: NodeProps) {
  const rabbit = rabbitId ? rabbitsMap[rabbitId] : null;
  const showChildren = generation < maxGen;

  const candidates = role
    ? rabbits.filter(
        (r) =>
          r.gender === (role === "father" ? "male" : "female") &&
          r.id !== childId,
      )
    : [];

  return (
    <div className="pedigree-node-row">
      <div
        className={`pedigree-card gen-${generation} ${
          rabbit ? rabbit.gender : "unknown"
        }`}
      >
        {rabbit ? (
          <>
            <div className="pedigree-card-name">
              {rabbit.gender === "female" ? "♀" : "♂"} {rabbit.name}
            </div>
            {rabbit.breed && (
              <div className="pedigree-card-breed">{rabbit.breed}</div>
            )}
            {rabbit.birth_date && (
              <div className="pedigree-card-date">
                {new Date(rabbit.birth_date).toLocaleDateString("uk-UA")}
              </div>
            )}
          </>
        ) : childId && role ? (
          <select
            className="pedigree-assign-select no-print"
            defaultValue=""
            onChange={(e) =>
              e.target.value && onAssign(childId, role, e.target.value)
            }
          >
            <option value="">
              {role === "father" ? "+ Батько невідомий" : "+ Мати невідома"}
            </option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="pedigree-card-unknown">Невідомо</div>
        )}
      </div>

      {showChildren && rabbit && (
        <div className="pedigree-children">
          <PedigreeNode
            rabbitId={rabbit?.father_id ?? null}
            childId={rabbit?.id ?? null}
            role="father"
            generation={generation + 1}
            maxGen={maxGen}
            rabbitsMap={rabbitsMap}
            rabbits={rabbits}
            onAssign={onAssign}
          />
          <PedigreeNode
            rabbitId={rabbit?.mother_id ?? null}
            childId={rabbit?.id ?? null}
            role="mother"
            generation={generation + 1}
            maxGen={maxGen}
            rabbitsMap={rabbitsMap}
            rabbits={rabbits}
            onAssign={onAssign}
          />
        </div>
      )}
    </div>
  );
}
