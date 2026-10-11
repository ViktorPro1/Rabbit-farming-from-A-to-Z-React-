import { supabase } from "../../lib/supabase";

// Вивантажує один CSV-файл з усіма розділами кабінету. Помилки не ловить:
// їх обробляє викликач (стан завантаження й повідомлення лишаються в компоненті).

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  return `"${String(value).replace(/"/g, '""')}"`;
}

function csvSection(
  title: string,
  headers: string[],
  rows: unknown[][],
): string {
  const lines = [
    csvCell(title),
    headers.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
  ];
  return lines.join("\n");
}

function genderLabel(g: string | null | undefined): string {
  if (g === "female") return "Самиця";
  if (g === "male") return "Самець";
  return "Невідомо";
}

export async function exportAllCSV(uid: string): Promise<void> {
  const sel = (table: string) =>
    supabase.from(table).select("*").eq("user_id", uid);

  const [
    rabbitsRes,
    matingsRes,
    littersRes,
    paddocksRes,
    paddockFemalesRes,
    paddockMatingsRes,
    paddockLittersRes,
    quarantineRes,
    treatmentsRes,
    vaccinationsRes,
    disinfectionsRes,
    medicationBatchesRes,
    weighingsRes,
    fatteningRes,
    salesRes,
    expensesRes,
    otherIncomeRes,
    grainRecipesRes,
  ] = await Promise.all([
    sel("rabbits").order("cage_number", { ascending: true }),
    sel("matings").order("mating_date", { ascending: true }),
    sel("litters").order("birth_date", { ascending: true }),
    sel("paddocks"),
    // paddock_females has no user_id column — RLS scopes it to the owner
    supabase.from("paddock_females").select("*"),
    sel("paddock_matings").order("mating_date", { ascending: true }),
    sel("paddock_litters").order("birth_date", { ascending: true }),
    sel("quarantine").order("moved_date", { ascending: true }),
    sel("treatments").order("date", { ascending: true }),
    sel("vaccinations").order("date", { ascending: true }),
    sel("cage_disinfections").order("disinfection_date", {
      ascending: true,
    }),
    sel("medication_batches").order("purchase_date", { ascending: true }),
    sel("weighings").order("weighing_date", { ascending: true }),
    sel("fattening").order("cage_number", { ascending: true }),
    sel("sales").order("sold_at", { ascending: true }),
    sel("expenses").order("expense_date", { ascending: true }),
    sel("other_income").order("income_date", { ascending: true }),
    sel("grain_recipes").order("created_at", { ascending: true }),
  ]);

  const firstError = [
    rabbitsRes,
    matingsRes,
    littersRes,
    paddocksRes,
    paddockFemalesRes,
    paddockMatingsRes,
    paddockLittersRes,
    quarantineRes,
    treatmentsRes,
    vaccinationsRes,
    disinfectionsRes,
    medicationBatchesRes,
    weighingsRes,
    fatteningRes,
    salesRes,
    expensesRes,
    otherIncomeRes,
    grainRecipesRes,
  ].find((r) => r.error)?.error;
  if (firstError) throw firstError;

  const rabbitsAll = rabbitsRes.data || [];
  const matings = matingsRes.data || [];
  const litters = littersRes.data || [];
  const paddocks = paddocksRes.data || [];
  const paddockFemales = paddockFemalesRes.data || [];
  const paddockMatings = paddockMatingsRes.data || [];
  const paddockLitters = paddockLittersRes.data || [];
  const quarantine = quarantineRes.data || [];
  const treatments = treatmentsRes.data || [];
  const vaccinations = vaccinationsRes.data || [];
  const disinfections = disinfectionsRes.data || [];
  const medicationBatches = medicationBatchesRes.data || [];
  const weighings = weighingsRes.data || [];
  const fattening = fatteningRes.data || [];
  const sales = salesRes.data || [];
  const expenses = expensesRes.data || [];
  const otherIncome = otherIncomeRes.data || [];
  const grainRecipes = grainRecipesRes.data || [];

  // ── Довідники для читабельних імен замість id ──
  const rabbitName = new Map(
    rabbitsAll.map((r) => [
      r.id,
      r.cage_number ? `${r.name} (клітка ${r.cage_number})` : r.name,
    ]),
  );
  const paddockName = new Map(paddocks.map((p) => [p.id, p.name]));
  const fatteningCage = new Map(
    fattening.map((f) => [f.id, f.cage_number]),
  );
  const nameOf = (id: string | null) => (id && rabbitName.get(id)) || "";
  const paddockOf = (id: string | null) =>
    (id && paddockName.get(id)) || "";
  const fatteningCageOf = (id: string | null) =>
    (id && fatteningCage.get(id)) || "";

  const sections = [
    csvSection(
      "РЕЄСТР КРОЛИКІВ",
      [
        "Кличка",
        "Стать",
        "Порода",
        "Дата нар.",
        "Клітка",
        "Мати",
        "Батько",
        "Нотатки",
      ],
      rabbitsAll.map((r) => [
        r.name,
        genderLabel(r.gender),
        r.breed || "",
        r.birth_date || "",
        r.cage_number || "",
        nameOf(r.mother_id),
        nameOf(r.father_id),
        r.notes || "",
      ]),
    ),
    csvSection(
      "ПАРУВАННЯ",
      [
        "Самиця",
        "Самець",
        "Клітка самиці",
        "Клітка самця",
        "Дата злучки",
        "Контрольна дата",
        "Очікуваний окріл",
        "Схема",
        "Нотатки",
      ],
      matings.map((m) => [
        nameOf(m.female_id),
        nameOf(m.male_id),
        m.female_cage || "",
        m.male_cage || "",
        m.mating_date || "",
        m.control_date || "",
        m.expected_birth || "",
        m.breeding_scheme || "",
        m.notes || "",
      ]),
    ),
    csvSection(
      "ОКРОЛИ (клітки)",
      [
        "Мати",
        "Батько",
        "Дата окролу",
        "Народилось",
        "Живих",
        "Загинуло",
        "Дата відлучення",
        "Відлучено всього",
        "Самців (клітка)",
        "Самиць (клітка)",
        "Нотатки",
      ],
      litters.map((l) => [
        nameOf(l.mother_id),
        nameOf(l.father_id),
        l.birth_date || "",
        l.total_born ?? "",
        l.alive ?? "",
        l.dead ?? "",
        l.weaned_date || "",
        l.weaned_count ?? "",
        l.weaned_males_cage
          ? `${l.weaned_males}/${l.weaned_males_cage}`
          : (l.weaned_males ?? ""),
        l.weaned_females_cage
          ? `${l.weaned_females}/${l.weaned_females_cage}`
          : (l.weaned_females ?? ""),
        l.notes || "",
      ]),
    ),
    csvSection(
      "ВОЛЬЄРИ",
      ["Назва вольєра", "Коєць", "Активний", "Нотатки"],
      paddocks.map((p) => [
        p.name,
        nameOf(p.male_id),
        p.is_active ? "Так" : "Ні",
        p.notes || "",
      ]),
    ),
    csvSection(
      "ВОЛЬЄРИ — самиці",
      ["Вольєр", "Самиця (реєстр)", "Кличка", "Порода", "Рік нар."],
      paddockFemales.map((f) => [
        paddockOf(f.paddock_id),
        nameOf(f.rabbit_id),
        f.name || "",
        f.breed || "",
        f.birth_year || "",
      ]),
    ),
    csvSection(
      "ВОЛЬЄРИ — парування",
      [
        "Вольєр",
        "Дата злучки",
        "Контрольна дата",
        "Очікуваний окріл",
        "Нотатки",
      ],
      paddockMatings.map((m) => [
        paddockOf(m.paddock_id),
        m.mating_date || "",
        m.control_date || "",
        m.expected_birth || "",
        m.notes || "",
      ]),
    ),
    csvSection(
      "ВОЛЬЄРИ — окроли",
      [
        "Дата окролу",
        "Окотилось самиць",
        "Народилось",
        "Живих",
        "Загинуло",
        "Дата відлучення",
        "Відлучено самців",
        "Відлучено самиць",
        "Нотатки",
      ],
      paddockLitters.map((l) => [
        l.birth_date || "",
        l.females_birthed ?? "",
        l.total_born ?? "",
        l.alive ?? "",
        l.dead ?? "",
        l.weaned_date || "",
        l.weaned_males ?? "",
        l.weaned_females ?? "",
        l.notes || "",
      ]),
    ),
    csvSection(
      "КАРАНТИН",
      [
        "Кличка",
        "Стать",
        "Порода",
        "З клітки",
        "Дата переміщення",
        "Причина",
        "Дата завершення",
        "Результат",
        "Нотатки",
      ],
      quarantine.map((q) => [
        q.rabbit_id ? nameOf(q.rabbit_id) : q.name,
        genderLabel(q.gender),
        q.breed || "",
        q.from_cage || "",
        q.moved_date || "",
        q.reason || "",
        q.end_date || "",
        q.result === "recovered"
          ? "Видужала"
          : q.result === "slaughter"
            ? "На забій"
            : q.result === "died"
              ? "Загинула"
              : "",
        q.notes || "",
      ]),
    ),
    csvSection(
      "ЛІКУВАННЯ",
      [
        "Клітка",
        "Препарат",
        "Спосіб введення",
        "Дата",
        "Курс (днів)",
        "Наступна дата",
        "Нотатки",
      ],
      treatments.map((t) => [
        t.cage_number,
        t.drug_name,
        t.route || "",
        t.date || "",
        t.course_days ?? "",
        t.next_date || "",
        t.notes || "",
      ]),
    ),
    csvSection(
      "ВАКЦИНАЦІЯ",
      ["Клітка", "Вакцина", "Тип", "Дата", "Наступна дата", "Нотатки"],
      vaccinations.map((v) => [
        v.cage_number,
        v.vaccine_name,
        v.vaccine_type || "",
        v.date || "",
        v.next_date || "",
        v.notes || "",
      ]),
    ),
    csvSection(
      "ДЕЗІНФЕКЦІЯ",
      ["Клітка", "Дата обробки", "Засіб", "Наступна дата", "Нотатки"],
      disinfections.map((d) => [
        d.cage_number,
        d.disinfection_date || "",
        d.product || "",
        d.next_date || "",
        d.notes || "",
      ]),
    ),
    csvSection(
      "АПТЕЧКА",
      [
        "Назва",
        "Дата покупки",
        "Термін придатності",
        "Куплено",
        "Залишок",
        "Од.",
        "Використано",
      ],
      medicationBatches.map((m) => [
        m.name,
        m.purchase_date || "",
        m.expiry_date || "",
        m.quantity_purchased ?? "",
        m.quantity_remaining ?? "",
        m.unit || "",
        m.used_up ? "Так" : "Ні",
      ]),
    ),
    csvSection(
      "ЗВАЖУВАННЯ",
      [
        "Гніздо/тварина",
        "Тварина (реєстр)",
        "Клітка відгодівлі",
        "Тип",
        "Дата",
        "Вага (г)",
        "Фінальне",
        "Категорія",
        "Нотатки",
      ],
      weighings.map((w) => [
        w.litter_label,
        nameOf(w.rabbit_id),
        fatteningCageOf(w.fattening_id),
        w.weighing_type === "fattening" ? "Відгодівля" : "Плем'ядро",
        w.weighing_date || "",
        w.weight_g ?? "",
        w.is_final ? "Так" : "Ні",
        w.size_category || "",
        w.notes || "",
      ]),
    ),
    csvSection(
      "ВІДГОДІВЛЯ",
      [
        "Клітка",
        "Самців",
        "Самиць",
        "Невідомо",
        "Порода",
        "Рік нар.",
        "Дата нар.",
        "Дата забою (план)",
        "Дата забою (факт)",
        "Вага туші (кг)",
        "Ціна за кг",
        "Активна",
        "Нотатки",
      ],
      fattening.map((f) => [
        f.cage_number,
        f.males ?? "",
        f.females ?? "",
        f.unknown ?? "",
        f.breed || "",
        f.birth_year || "",
        f.birth_date || "",
        f.slaughter_date || "",
        f.slaughtered_at || "",
        f.carcass_weight_kg ?? "",
        f.carcass_price_per_kg ?? "",
        f.is_active ? "Так" : "Ні",
        f.notes || "",
      ]),
    ),
    csvSection(
      "ПРОДАЖІ",
      [
        "Клітка",
        "Порода",
        "Самців",
        "Самиць",
        "Невідомо",
        "Ціна",
        "Покупець",
        "Дата продажу",
        "Нотатки",
      ],
      sales.map((s) => [
        s.cage_number || fatteningCageOf(s.fattening_id),
        s.breed || "",
        s.males ?? "",
        s.females ?? "",
        s.unknown ?? "",
        s.price ?? "",
        s.buyer || "",
        s.sold_at || "",
        s.notes || "",
      ]),
    ),
    csvSection(
      "ФІНАНСИ — витрати",
      ["Категорія", "Сума", "Дата", "Опис"],
      expenses.map((e) => [
        e.category,
        e.amount,
        e.expense_date || "",
        e.description || "",
      ]),
    ),
    csvSection(
      "ФІНАНСИ — інші доходи",
      ["Категорія", "Сума", "Дата", "Опис"],
      otherIncome.map((i) => [
        i.category,
        i.amount,
        i.income_date || "",
        i.description || "",
      ]),
    ),
    csvSection(
      "РАЦІОНИ",
      [
        "Дата",
        "Режим",
        "Всього (кг)",
        "Люцерна (кг)",
        "Сіль (г)",
        "Премікс (г)",
        "Склад",
      ],
      grainRecipes.map((g) => [
        g.created_at ? g.created_at.slice(0, 10) : "",
        g.mode || "",
        g.total_kg ?? "",
        g.lucerne_kg ?? "",
        g.salt_g ?? "",
        g.premix_g ?? "",
        g.items ? JSON.stringify(g.items) : "",
      ]),
    ),
  ];

  const csv = sections.join("\n\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `експорт-даних-кролівника-${new Date().toLocaleDateString("uk-UA")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
