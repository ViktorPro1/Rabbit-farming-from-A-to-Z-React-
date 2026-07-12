import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./CageSearch.css";

interface Props {
  session: Session;
}

interface CageEvent {
  date: string;
  type: string;
  icon: string;
  description: string;
}

// Перевіряє, чи входить target-клітка в текстове значення поля
// (враховує "4", "4-6", "2-3", "8.9.10.11", "Від 1 по 14")
function cageMatches(
  cageStr: string | null | undefined,
  target: string,
): boolean {
  if (!cageStr) return false;
  const targetNum = parseInt(target, 10);
  if (isNaN(targetNum)) return false;

  const rangeMatch = cageStr.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    if (targetNum >= start && targetNum <= end) return true;
  }

  const vidMatch = cageStr.match(/від\s*(\d+)\s*по\s*(\d+)/i);
  if (vidMatch) {
    const start = parseInt(vidMatch[1], 10);
    const end = parseInt(vidMatch[2], 10);
    if (targetNum >= start && targetNum <= end) return true;
  }

  const nums = cageStr.match(/\d+/g)?.map(Number) || [];
  return nums.includes(targetNum);
}

interface MatingCageInfo {
  male_cage: string;
  female_cage: string;
}

export default function CageSearch({ session }: Props) {
  const [cageNumber, setCageNumber] = useState("");
  const [events, setEvents] = useState<CageEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  async function handleSearch() {
    const num = cageNumber.trim();
    if (!num) return;
    setLoading(true);
    setSearched(true);

    const [
      rabbitsRes,
      disinfectionsRes,
      fatteningRes,
      quarantineRes,
      treatmentsRes,
      vaccinationsRes,
      matingsRes,
      littersRes,
    ] = await Promise.all([
      supabase.from("rabbits").select("*").eq("user_id", session.user.id),
      supabase
        .from("cage_disinfections")
        .select("*")
        .eq("user_id", session.user.id),
      supabase.from("fattening").select("*").eq("user_id", session.user.id),
      supabase.from("quarantine").select("*").eq("user_id", session.user.id),
      supabase.from("treatments").select("*").eq("user_id", session.user.id),
      supabase.from("vaccinations").select("*").eq("user_id", session.user.id),
      supabase.from("matings").select("*").eq("user_id", session.user.id),
      supabase.from("litters").select("*").eq("user_id", session.user.id),
    ]);

    const list: CageEvent[] = [];

    (rabbitsRes.data || [])
      .filter((r) => cageMatches(r.cage_number, num))
      .forEach((r) => {
        list.push({
          date: r.birth_date || "",
          type:
            r.gender === "female" ? "Кроличка у реєстрі" : "Кролик у реєстрі",
          icon: r.gender === "female" ? "♀" : "♂",
          description: `${r.name}${r.breed ? ` (${r.breed})` : ""}${r.is_active ? "" : " — в архіві"}`,
        });
      });

    (disinfectionsRes.data || [])
      .filter((d) => cageMatches(d.cage_number, num))
      .forEach((d) => {
        list.push({
          date: d.disinfection_date,
          type: "Дезінфекція",
          icon: "🧴",
          description: d.product
            ? `Засіб: ${d.product}`
            : "Проведена дезінфекція",
        });
      });

    (fatteningRes.data || [])
      .filter((f) => cageMatches(f.cage_number, num))
      .forEach((f) => {
        list.push({
          date: f.birth_date || f.created_at,
          type: "Відгодівля",
          icon: "🥩",
          description: `${f.breed || "Партія"}: ♂${f.males || 0} ♀${f.females || 0}${
            f.slaughter_date ? `, забій ${f.slaughter_date}` : ""
          }`,
        });
      });

    (quarantineRes.data || [])
      .filter((q) => cageMatches(q.from_cage, num))
      .forEach((q) => {
        list.push({
          date: q.moved_date,
          type: "Карантин",
          icon: "🔒",
          description: `${q.name || "Тварина"}: ${q.reason || "причина не вказана"}${
            q.result ? `, результат: ${q.result}` : ""
          }`,
        });
      });

    (treatmentsRes.data || [])
      .filter((t) => cageMatches(t.cage_number, num))
      .forEach((t) => {
        list.push({
          date: t.date,
          type: "Пропойка",
          icon: "💊",
          description: t.drug_name || "Препарат",
        });
      });

    (vaccinationsRes.data || [])
      .filter((v) => cageMatches(v.cage_number, num))
      .forEach((v) => {
        list.push({
          date: v.date,
          type: "Вакцинація",
          icon: "💉",
          description: v.vaccine_name || v.vaccine_type || "Вакцина",
        });
      });

    (matingsRes.data || [])
      .filter(
        (m) => cageMatches(m.male_cage, num) || cageMatches(m.female_cage, num),
      )
      .forEach((m) => {
        list.push({
          date: m.mating_date,
          type: "Злучка",
          icon: "🐇",
          description: `Клітка коєця: ${m.male_cage || "—"}, клітка крольчихи: ${
            m.female_cage || "—"
          }${m.expected_birth ? `, очік. окріл: ${m.expected_birth}` : ""}`,
        });
      });

    const matingsById: Record<string, MatingCageInfo> = {};
    (matingsRes.data || []).forEach((m) => {
      matingsById[m.id] = {
        male_cage: m.male_cage,
        female_cage: m.female_cage,
      };
    });

    (littersRes.data || []).forEach((l) => {
      const parentMating = matingsById[l.mating_id];
      const birthCageMatches =
        parentMating && cageMatches(parentMating.female_cage, num);

      if (birthCageMatches && l.birth_date) {
        list.push({
          date: l.birth_date,
          type: "Окріл (народження в цій клітці)",
          icon: "🐰",
          description: `Народилось: ${l.total_born ?? "?"}, живих: ${l.alive ?? "?"}${
            l.weaned_date ? `, відлучено ${l.weaned_date}` : ""
          }`,
        });
      }

      const weanedHereM = cageMatches(l.weaned_males_cage, num);
      const weanedHereF = cageMatches(l.weaned_females_cage, num);
      if (weanedHereM || weanedHereF) {
        list.push({
          date: l.weaned_date || l.birth_date,
          type: "Молодняк відсаджено сюди",
          icon: "🐰",
          description: `${weanedHereM ? `♂ ${l.weaned_males} гол. ` : ""}${
            weanedHereF ? `♀ ${l.weaned_females} гол.` : ""
          }`.trim(),
        });
      }
    });

    list.sort((a, b) => (a.date || "").localeCompare(b.date || ""));

    setEvents(list);
    setLoading(false);
  }

  return (
    <div className="cage-search-page">
      <div className="cage-search-header">
        <h1>🔍 Пошук по клітці</h1>
        <button
          className="cage-search-back-btn"
          onClick={() => navigate("/registry")}
        >
          {"⬅"} Мої кролики
        </button>
      </div>
      <p className="cage-search-hint">
        Введи номер клітки — покажемо всю історію: злучки, окроли, вакцинації,
        пропойки, дезінфекцію, відгодівлю і карантин.
      </p>

      <div className="cage-search-form">
        <input
          type="text"
          id="cage-number-input"
          name="cageNumber"
          placeholder="Номер клітки"
          value={cageNumber}
          onChange={(e) => setCageNumber(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading || !cageNumber.trim()}>
          {loading ? "Пошук..." : "Показати"}
        </button>
      </div>

      {searched && !loading && events.length === 0 && (
        <p className="cage-search-empty">
          Нічого не знайдено для клітки № {cageNumber}.
        </p>
      )}

      {events.length > 0 && (
        <div className="cage-timeline">
          {events.map((ev, i) => (
            <div key={i} className="cage-timeline-item">
              <span className="cage-timeline-icon">{ev.icon}</span>
              <div className="cage-timeline-body">
                <div className="cage-timeline-header">
                  <strong>{ev.type}</strong>
                  <span className="cage-timeline-date">
                    {ev.date
                      ? new Date(ev.date).toLocaleDateString("uk-UA")
                      : ""}
                  </span>
                </div>
                <p>{ev.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
