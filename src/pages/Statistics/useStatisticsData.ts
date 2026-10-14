import { useEffect, useState } from "react";
import { logError } from "../../lib/logError";
import { LOAD_ERROR } from "./constants";
import { fetchIndependentStats, fetchLitters } from "./fetchStatistics";
import {
  computeAccuracyStats,
  computeBreedingStats,
  computeFailureStats,
  createPersonResolver,
  groupLittersByMating,
} from "./breedingStats";
import {
  addLittersToMonthly,
  buildBaseMonthly,
  sortedMonthly,
} from "./monthly";
import type {
  CageStat,
  FemaleAccuracyStat,
  FemaleFailureStat,
  LitterRow,
  MatingRow,
  MonthlyStat,
  PairStat,
  PaddockLitterRow,
  RabbitRef,
  RabbitStat,
  RegistryExitRow,
  SaleRecord,
  SlaughteredCage,
} from "./types";

// Завантажує всю статистику сторінки і рахує похідні списки.
// Перезавантажується при зміні користувача або переході на сторінку
// (locationKey).
export function useStatisticsData(userId: string, locationKey: string) {
  const [femaleStats, setFemaleStats] = useState<RabbitStat[]>([]);
  const [maleStats, setMaleStats] = useState<RabbitStat[]>([]);
  const [pairStats, setPairStats] = useState<PairStat[]>([]);
  const [cageStats, setCageStats] = useState<CageStat[]>([]);
  const [accuracyStats, setAccuracyStats] = useState<FemaleAccuracyStat[]>([]);
  const [slaughteredCages, setSlaughteredCages] = useState<SlaughteredCage[]>(
    [],
  );
  const [salesData, setSalesData] = useState<SaleRecord[]>([]);
  const [failureStats, setFailureStats] = useState<FemaleFailureStat[]>([]);
  const [loading, setLoading] = useState(true);
  // Повідомлення про помилку завантаження статистики
  const [pageError, setPageError] = useState("");
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [quarantineDeaths, setQuarantineDeaths] = useState(0);
  // Поточне плем'я стадо: лише активні кролики реєстру (архівні, забиті,
  // продані й ті, що вибули, не враховуються)
  const [herdCount, setHerdCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setLoading(true);
      setPageError("");

      const [
        slaughteredRes,
        salesRes,
        paddockLittersRes,
        registryExitsRes,
        quarantineDiedRes,
        matingsRes,
        rabbitsRes,
      ] = await fetchIndependentStats(userId);

      if (cancelled) return;

      const failedQuery = [
        slaughteredRes,
        salesRes,
        paddockLittersRes,
        registryExitsRes,
        quarantineDiedRes,
        matingsRes,
        rabbitsRes,
      ].find((r) => r.error);
      if (failedQuery?.error) {
        logError("Statistics.loadStats", failedQuery.error);
        setPageError(LOAD_ERROR);
        setLoading(false);
        return;
      }

      const slaughtered: SlaughteredCage[] = slaughteredRes.data || [];
      const sales: SaleRecord[] = salesRes.data || [];
      const paddockLitters: PaddockLitterRow[] = paddockLittersRes.data || [];
      const registryExits: RegistryExitRow[] = registryExitsRes.data || [];
      const quarantineDied = quarantineDiedRes.data;
      const matingsData = matingsRes.data;
      const rabbitsData = rabbitsRes.data;

      setHerdCount((rabbitsData || []).filter((r) => r.is_active).length);
      setSlaughteredCages(slaughtered);
      setSalesData(sales);

      const { monthlyMap, registryDied } = buildBaseMonthly(
        slaughtered,
        sales,
        paddockLitters,
        registryExits,
      );

      setQuarantineDeaths(registryDied + (quarantineDied || []).length);

      if (!matingsData || matingsData.length === 0) {
        setMonthlyStats(sortedMonthly(monthlyMap));
        setLoading(false);
        return;
      }

      const matings: MatingRow[] = matingsData;
      const matingIds = matings.map((m) => m.id);
      const { data: littersData, error: littersError } =
        await fetchLitters(matingIds);

      if (cancelled) return;
      if (littersError) {
        logError("Statistics.loadStats", littersError);
        setPageError(LOAD_ERROR);
        setLoading(false);
        return;
      }
      const litters: LitterRow[] = littersData || [];

      // Усі кролики користувача вже завантажені паралельно вище
      const rabbitById = new Map<string, RabbitRef>(
        (rabbitsData || []).map((r) => [r.id as string, r as RabbitRef]),
      );
      const matingById = new Map<string, MatingRow>(
        matings.map((m) => [m.id, m]),
      );
      const resolver = createPersonResolver(rabbitById);

      setFailureStats(computeFailureStats(litters, matingById, resolver));

      // Огляд: додаємо народжено по місяцях
      addLittersToMonthly(monthlyMap, litters);
      setMonthlyStats(sortedMonthly(monthlyMap));

      const breeding = computeBreedingStats(
        matings,
        groupLittersByMating(litters),
        resolver,
      );
      setFemaleStats(breeding.femaleStats);
      setMaleStats(breeding.maleStats);
      setPairStats(breeding.pairStats);
      setCageStats(breeding.cageStats);

      setAccuracyStats(computeAccuracyStats(litters, matingById, resolver));

      setLoading(false);
    }
    // Мережевий збій (відхилений Promise.all) або виняток під час обробки
    // не повинні залишати сторінку в стані «Завантаження...» — знімаємо
    // індикатор і показуємо повідомлення.
    loadStats().catch((e) => {
      if (cancelled) return;
      logError("Statistics.loadStats", e);
      setPageError(LOAD_ERROR);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [userId, locationKey]);

  return {
    femaleStats,
    maleStats,
    pairStats,
    cageStats,
    accuracyStats,
    slaughteredCages,
    salesData,
    failureStats,
    monthlyStats,
    quarantineDeaths,
    herdCount,
    loading,
    pageError,
  };
}
