export type LocusKey = "A" | "B" | "C" | "D" | "E";

export interface LocusInfo {
    key: LocusKey;
    name: string;
    alleles: string[];
    alleleLabels: Record<string, string>;
}

export const LOCI: LocusInfo[] = [
    {
        key: "A",
        name: "Агуті (малюнок волосини)",
        alleles: ["A", "at", "a"],
        alleleLabels: { A: "A (агуті)", at: "at (тан/підпал)", a: "a (суцільний)" },
    },
    {
        key: "B",
        name: "Базовий пігмент",
        alleles: ["B", "b"],
        alleleLabels: { B: "B (чорний пігмент)", b: "b (шоколадний пігмент)" },
    },
    {
        key: "C",
        name: "Інтенсивність / альбінізм",
        alleles: ["C", "cchd", "cchl", "ch", "c"],
        alleleLabels: {
            C: "C (повний колір)",
            cchd: "cchd (шиншила)",
            cchl: "cchl (соболь)",
            ch: "ch (гімалайський)",
            c: "c (альбінос)",
        },
    },
    {
        key: "D",
        name: "Дилюція",
        alleles: ["D", "d"],
        alleleLabels: { D: "D (насичений)", d: "d (розведений)" },
    },
    {
        key: "E",
        name: "Розповсюдження пігменту",
        alleles: ["E", "ej", "e"],
        alleleLabels: { E: "E (норма)", ej: "ej (арлекін/японський)", e: "e (нон-екстеншн)" },
    },
];

export type DataStatus = "confident" | "approximate" | "multicolor" | "unknown";

export interface BreedColorInfo {
    breedId: string;
    dataStatus: DataStatus;
    genotype?: Partial<Record<LocusKey, string>>;
    standardColors: string[];
    note?: string;
}

export const BREED_COLOR_DATA: Record<string, BreedColorInfo> = {
    californian: {
        dataStatus: "confident",
        breedId: "californian",
        genotype: { A: "a", B: "B", C: "ch", D: "D", E: "E" },
        standardColors: ["Гімалайський малюнок: біле тіло, чорні мітки (ніс, вуха, лапи, хвіст)"],
        note: "У деяких стандартах допускаються й інші кольори міток (шоколад, блакитний) — тут наведено класичний чорноокий варіант.",
    },
    "new-zealand": {
        dataStatus: "confident",
        breedId: "new-zealand",
        genotype: { A: "a", B: "B", C: "c", D: "D", E: "E" },
        standardColors: ["Альбінос (повністю білий, червоні очі)"],
        note: "Породу також розводять у чорному й рудому варіантах — це вже інший генотип за C locus (C_ замість cc). Наведено класичний білий різновид.",
    },
    burgundy: {
        dataStatus: "approximate",
        breedId: "burgundy",
        genotype: { A: "A", B: "B", C: "C", D: "D", E: "e" },
        standardColors: ["Одноколірний рудувато-каштановий (фаун)"],
        note: "Орієнтовний генотип для класичного 'фаун' окрасу (агуті + нон-екстеншн). Точні дані по вашій лінії краще звірити з реальним стандартом.",
    },
    flandr: {
        dataStatus: "approximate",
        breedId: "flandr",
        genotype: { A: "A", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Сірий (заячий) — класичний варіант", "Чорний", "Білий", "Пісочний", "Блакитний — залежно від лінії"],
        note: "Наведено генотип лише для класичного сірого (заячого) варіанту — стандарт допускає й інші кольори, для них потрібен інший генотип.",
    },
    "german-spotted-giant": {
        dataStatus: "approximate",
        breedId: "german-spotted-giant",
        genotype: { A: "a", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Плямистий (контрастні чорні плями на білому тлі)"],
        note: "Вказано лише базовий колір самих плям (чорний). Сам малюнок плямистості визначається геном En, який не входить до цієї моделі — розрахунок покаже колір плям, але не спрогнозує, будуть вони плямистими чи ні.",
    },
    "grey-giant": {
        dataStatus: "approximate",
        breedId: "grey-giant",
        genotype: { A: "A", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Сірий (заячий агуті)"],
    },
    "white-giant": {
        dataStatus: "confident",
        breedId: "white-giant",
        genotype: { A: "a", B: "B", C: "c", D: "D", E: "E" },
        standardColors: ["Альбінос (білий, червоні очі)"],
    },
    chinchilla: {
        dataStatus: "approximate",
        breedId: "chinchilla",
        genotype: { A: "A", B: "B", C: "cchd", D: "D", E: "E" },
        standardColors: ["Шиншиловий (сіро-перлинний з чорною основою)"],
    },
    "chinchilla-giant": {
        dataStatus: "approximate",
        breedId: "chinchilla-giant",
        genotype: { A: "A", B: "B", C: "cchd", D: "D", E: "E" },
        standardColors: ["Шиншиловий (сіро-перлинний, велика форма)"],
    },
    rex: {
        dataStatus: "approximate",
        breedId: "rex",
        genotype: { A: "A", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Кастор (чорно-агуті) — найпоширеніший варіант", "і десятки інших окрасів"],
        note: "Ген Рекс — окремий локус текстури хутра, не пов'язаний із кольором. Наведено генотип лише для найпопулярнішого окрасу 'кастор'; порода приймається в багатьох інших кольорах.",
    },
    "vienna-blue": {
        dataStatus: "approximate",
        breedId: "vienna-blue",
        genotype: { A: "a", B: "B", C: "C", D: "d", E: "E" },
        standardColors: ["Блакитний, суцільний"],
        note: "Реальний 'віденський' блакитний часто пов'язаний з окремим геном Vienna (блакитноокість), який відрізняється від простої D-дилюції — трактуйте як спрощення.",
    },
    "black-brown": {
        dataStatus: "approximate",
        breedId: "black-brown",
        genotype: { A: "A", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Чорно-бурий агуті"],
    },
    "poltava-silver": {
        dataStatus: "approximate",
        breedId: "poltava-silver",
        genotype: { A: "a", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Срібний (з віком волосся набуває сивини)"],
        note: "Вказано базовий колір, у якому кроленята народжуються (суцільний чорний). Сам ефект сріблення з віком — окремий ген (Si), не входить до моделі, тож розрахунок не покаже, наскільки посивіє тварина.",
    },
    butterfly: {
        dataStatus: "approximate",
        breedId: "butterfly",
        genotype: { A: "a", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Плямистий ('метелик' на носі + плями по тілу), базовий колір плям — чорний"],
        note: "Вказано лише базовий колір плям. Сам малюнок плямистості — ген En, не входить до моделі.",
    },
    satin: {
        dataStatus: "approximate",
        breedId: "satin",
        genotype: { A: "A", B: "B", C: "C", D: "D", E: "e" },
        standardColors: ["Рудий (одна з найпоширеніших сатинових мастей)", "і багато інших"],
        note: "'Сатин' — ген структури хутра (блиск), не кольору. Наведено генотип лише для рудого варіанту.",
    },
    termond: {
        dataStatus: "approximate",
        breedId: "termond",
        genotype: { A: "a", B: "B", C: "c", D: "D", E: "E" },
        standardColors: ["Білий (типово)"],
        note: "Припущено, що це справжній альбінос (cc). Якщо у вашої лінії блакитні (не червоні) очі — це інший ген, і дані потребують уточнення.",
    },
    himalayan: {
        dataStatus: "confident",
        breedId: "himalayan",
        genotype: { A: "a", B: "B", C: "ch", D: "D", E: "E" },
        standardColors: ["Гімалайський малюнок: біле тіло, чорні мітки"],
    },
    khilla: {
        dataStatus: "approximate",
        breedId: "khilla",
        genotype: { A: "A", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Кілька окрасів — стандарт кольору ще не закритий, наведено типовий агуті-варіант"],
    },
    "pannonian-white": {
        dataStatus: "confident",
        breedId: "pannonian-white",
        genotype: { A: "a", B: "B", C: "c", D: "D", E: "E" },
        standardColors: ["Альбінос (білий, червоні очі)"],
    },
    "vienna-white": {
        dataStatus: "approximate",
        breedId: "vienna-white",
        genotype: { A: "a", B: "B", C: "c", D: "D", E: "E" },
        standardColors: ["Білий (типово блакитноокий)"],
        note: "Класична 'віденська білизна' — окремий ген (не альбінізм cc). Тут використано альбінос як функціональне наближення (дає такий самий білий результат, але без блакитних очей) — для точності потрібне уточнення.",
    },
    riga: {
        dataStatus: "approximate",
        breedId: "riga",
        genotype: { A: "A", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Сірий — типовий варіант", "варіації допускаються залежно від лінії"],
    },
    champagne: {
        dataStatus: "approximate",
        breedId: "champagne",
        genotype: { A: "a", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Срібний (народжуються чорними, з віком світлішають)"],
        note: "Вказано колір при народженні (суцільний чорний). Як і Полтавське срібло — сам ефект сріблення потребує гена Si поза базовою моделлю.",
    },
    "soviet-marder": {
        dataStatus: "approximate",
        breedId: "soviet-marder",
        genotype: { A: "at", B: "b", C: "cchl", D: "D", E: "E" },
        standardColors: ["Темно-коричневий з світлішим підпалом ('куницевий' малюнок)"],
    },
    squirrel: {
        dataStatus: "approximate",
        breedId: "squirrel",
        genotype: { A: "A", B: "B", C: "cchd", D: "d", E: "E" },
        standardColors: ["Сірий 'білчастий' підшерсток (блакитна шиншила)"],
    },
    hyla: {
        dataStatus: "approximate",
        breedId: "hyla",
        genotype: { A: "a", B: "B", C: "c", D: "D", E: "E" },
        standardColors: ["Білий (промисловий кросбредний матеріал)"],
        note: "Батьківські лінії закриті й патентовані — генотип орієнтовний.",
    },
    "french-lop": {
        dataStatus: "approximate",
        breedId: "french-lop",
        genotype: { A: "a", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Кілька окрасів допускається стандартом, наведено суцільний чорний як типовий"],
    },
    "dwarf-lop": {
        dataStatus: "approximate",
        breedId: "dwarf-lop",
        genotype: { A: "A", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Дуже широкий спектр окрасів, наведено агуті як типовий"],
    },
    netherland: {
        dataStatus: "approximate",
        breedId: "netherland",
        genotype: { A: "a", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Дуже широкий спектр окрасів, наведено суцільний чорний як типовий"],
    },
    angora: {
        dataStatus: "approximate",
        breedId: "angora",
        genotype: { A: "a", B: "B", C: "c", D: "D", E: "E" },
        standardColors: ["Кілька окрасів допускається стандартом, наведено білий (альбінос) як типовий"],
    },
    lionhead: {
        dataStatus: "approximate",
        breedId: "lionhead",
        genotype: { A: "a", B: "B", C: "C", D: "D", E: "E" },
        standardColors: ["Кілька окрасів допускається стандартом, наведено суцільний чорний як типовий"],
    },
};

// ---------- Рушій розрахунку ----------

function locusAlleles(key: LocusKey): string[] {
    return LOCI.find((l) => l.key === key)!.alleles;
}

function crossLocus(parentAAllele: string, parentBAllele: string): [string, string] {
    return [parentAAllele, parentBAllele];
}

function dominantAllele(key: LocusKey, genotype: [string, string]): string {
    const order = locusAlleles(key);
    return genotype.sort((x, y) => order.indexOf(x) - order.indexOf(y))[0];
}

function baseColorName(bDom: string, dDom: string): string {
    const dilute = dDom === "d";
    const choc = bDom === "b";
    if (!choc && !dilute) return "Чорний";
    if (!choc && dilute) return "Блакитний";
    if (choc && !dilute) return "Шоколадний";
    return "Лілововий";
}

function applyAgouti(base: string, aDom: string): string {
    if (aDom === "A") return `${base} агуті`;
    if (aDom === "at") return `${base} з підпалом (тан)`;
    return `Суцільний ${base.toLowerCase()}`;
}

function applyC(phenotype: string, cDom: string, base: string): string {
    switch (cDom) {
        case "c":
            return "Альбінос (білий, червоні очі)";
        case "ch":
            return `Гімалайський малюнок (біле тіло, мітки: ${base.toLowerCase()})`;
        case "cchl":
            return `Соболиний відтінок (${phenotype.toLowerCase()})`;
        case "cchd":
            return `Шиншиловий відтінок (${phenotype.toLowerCase()})`;
        default:
            return phenotype;
    }
}

function applyE(phenotype: string, eDom: string): string {
    if (eDom === "e") return `${phenotype} — нон-екстеншн (рудуватий відтінок замість чорного пігменту)`;
    if (eDom === "ej") return `${phenotype} — арлекін/японський розподіл (плямиста нерівномірність пігменту)`;
    return phenotype;
}

export interface OffspringResult {
    phenotype: string;
    probability: number; // 0..1
}

export function calculateOffspring(
    genoA: Partial<Record<LocusKey, string>>,
    genoB: Partial<Record<LocusKey, string>>
): OffspringResult[] {
    const dominants: Partial<Record<LocusKey, string>> = {};

    for (const locus of LOCI) {
        const alleleA = genoA[locus.key] ?? locus.alleles[0];
        const alleleB = genoB[locus.key] ?? locus.alleles[0];
        const pair = crossLocus(alleleA, alleleB);
        dominants[locus.key] = dominantAllele(locus.key, pair);
    }

    const base = baseColorName(dominants.B!, dominants.D!);
    let phenotype = applyAgouti(base, dominants.A!);
    phenotype = applyC(phenotype, dominants.C!, base);
    phenotype = applyE(phenotype, dominants.E!);

    return [{ phenotype, probability: 1 }];
}