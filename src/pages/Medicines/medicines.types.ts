export type Category =
    | "all"
    | "antiparasitic"
    | "antibiotic"
    | "injection"
    | "vitamins"
    | "external"
    | "gi"
    | "iodine";

export interface Medicine {
    name: string;
    category: Category;
    icon: string;
    whatIsIt?: string;
    symptoms?: string;
    description: string;
    usage: string;
    dosagePrevention?: string;
    dosageTreatment?: string;
    dosage?: string;
    course: string;
    injectionSite?: string;
    preparation?: string;
    warning?: string;
}