import { useEffect, useMemo, useState } from "react";
import { logError } from "../../lib/logError";
import { WEIGHING_LOAD_ERROR } from "./constants";
import { fetchWeighingData } from "./fetchStatistics";
import { buildClosedCyclesForCage, headsOf, sortByWeighingDate } from "./utils";
import type {
  ActiveCageStat,
  ClosedCycle,
  FarmTotals,
  FatteningRow,
  MonthlyComparison,
  MonthlyWeightAvg,
  WeighingRow,
} from "./types";

// Дані для вкладки «Зважування» — завантажуються окремо від решти
// статистики (незалежний ефект), щоб збій тут не зачіпав інші вкладки.
export function useWeighingData(userId: string) {
  const [weighingFattening, setWeighingFattening] = useState<FatteningRow[]>(
    [],
  );
  const [weighingRecords, setWeighingRecords] = useState<WeighingRow[]>([]);
  const [weighingTabLoading, setWeighingTabLoading] = useState(true);
  const [weighingTabError, setWeighingTabError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadWeighingTab() {
      setWeighingTabLoading(true);
      setWeighingTabError("");
      try {
        const [fatteningRes, weighingsRes] = await fetchWeighingData(userId);
        if (cancelled) return;
        if (fatteningRes.error || weighingsRes.error) {
          logError(
            "Statistics.loadWeighingTab",
            fatteningRes.error || weighingsRes.error,
          );
          setWeighingTabError(WEIGHING_LOAD_ERROR);
          return;
        }
        setWeighingFattening((fatteningRes.data || []) as FatteningRow[]);
        setWeighingRecords((weighingsRes.data || []) as WeighingRow[]);
      } catch (e) {
        if (!cancelled) {
          logError("Statistics.loadWeighingTab", e);
          setWeighingTabError(WEIGHING_LOAD_ERROR);
        }
      } finally {
        if (!cancelled) setWeighingTabLoading(false);
      }
    }

    loadWeighingTab();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const weighingsByFattening = useMemo(() => {
    const map: Record<string, WeighingRow[]> = {};
    weighingRecords.forEach((w) => {
      if (!w.fattening_id) return;
      if (!map[w.fattening_id]) map[w.fattening_id] = [];
      map[w.fattening_id].push(w);
    });
    return map;
  }, [weighingRecords]);

  const activeCages: ActiveCageStat[] = useMemo(() => {
    return weighingFattening
      .filter((f) => f.is_active)
      .map((f) => {
        const list = sortByWeighingDate(weighingsByFattening[f.id] || []);
        const last = list[list.length - 1] || null;
        const daysInCycle = f.birth_date
          ? Math.round(
              (Date.now() - new Date(f.birth_date).getTime()) /
                (1000 * 60 * 60 * 24),
            )
          : null;
        return {
          cage: f.cage_number,
          heads: headsOf(f),
          latestWeight: last ? last.weight_g : null,
          latestDate: last ? last.weighing_date : null,
          daysInCycle,
        };
      })
      .sort((a, b) => a.cage.localeCompare(b.cage, "uk", { numeric: true }));
  }, [weighingFattening, weighingsByFattening]);

  const farmTotals: FarmTotals = useMemo(() => {
    let heads = 0;
    let estimatedWeightG = 0;
    let cagesWithWeight = 0;
    activeCages.forEach((c) => {
      heads += c.heads;
      if (c.latestWeight !== null) {
        estimatedWeightG += c.latestWeight * c.heads;
        cagesWithWeight += 1;
      }
    });
    return {
      heads,
      estimatedWeightG,
      cagesWithWeight,
      cageCount: activeCages.length,
    };
  }, [activeCages]);

  const closedCycles: ClosedCycle[] = useMemo(() => {
    const result: ClosedCycle[] = [];
    weighingFattening.forEach((f) => {
      const list = sortByWeighingDate(weighingsByFattening[f.id] || []);
      result.push(...buildClosedCyclesForCage(f.cage_number, list));
    });
    return result.sort(
      (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    );
  }, [weighingFattening, weighingsByFattening]);

  const monthlyAvgAll: MonthlyWeightAvg[] = useMemo(() => {
    const map: Record<string, number[]> = {};
    weighingRecords.forEach((w) => {
      const key = w.weighing_date.slice(0, 7);
      if (!map[key]) map[key] = [];
      map[key].push(w.weight_g);
    });
    return Object.entries(map)
      .map(([monthKey, weights]) => ({
        monthKey,
        avgWeight: Math.round(
          weights.reduce((s, x) => s + x, 0) / weights.length,
        ),
        count: weights.length,
      }))
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [weighingRecords]);

  const monthlyComparison: MonthlyComparison[] = useMemo(() => {
    const map: Record<string, { weights: number[]; durations: number[] }> = {};
    closedCycles.forEach((c) => {
      if (!map[c.monthKey]) map[c.monthKey] = { weights: [], durations: [] };
      map[c.monthKey].weights.push(c.finalAvgWeight);
      map[c.monthKey].durations.push(c.durationDays);
    });
    return Object.entries(map)
      .map(([monthKey, v]) => ({
        monthKey,
        avgWeight: Math.round(
          v.weights.reduce((s, x) => s + x, 0) / v.weights.length,
        ),
        avgDuration: Math.round(
          v.durations.reduce((s, x) => s + x, 0) / v.durations.length,
        ),
      }))
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [closedCycles]);

  return {
    weighingTabLoading,
    weighingTabError,
    activeCages,
    farmTotals,
    closedCycles,
    monthlyAvgAll,
    monthlyComparison,
  };
}
