export interface OnlineVisitor {
  session_id: string;
  page: string;
  joined_at: string;
}

export interface UserDataUsage {
  userId: string;
  email: string | null;
  totalBytes: number;
  dataBytes: number;
}

export interface LeadRow {
  id: string;
  email: string;
  source: string;
  created_at: string;
}

export interface NpsFeedbackRow {
  id: string;
  score: number;
  category: "detractor" | "passive" | "promoter";
  comment: string | null;
  created_at: string;
}

export interface DeactivatedUser {
  id: string;
  email: string;
}

export interface TableStat {
  name: string;
  label: string;
  count: number;
}

export interface BackendStats {
  dbSizeBytes: number | null;
  // Скільки місця й файлів у сховищі (Supabase Storage)
  storageBytes: number | null;
  storageFiles: number | null;
  tableCounts: TableStat[];
  totalUsers: number;
  totalCodes: number;
  usedCodes: number;
  freeCodes: number;
}

export interface InviteCode {
  id: string;
  code: string;
  is_used: boolean;
  used_by: string | null;
  created_at: string;
}

// Єдиний тип плану, щоб не дублювати об'єднання в кількох місцях
export type PlanType = "trial" | "paid" | "founder" | "vip";

export interface RegisteredUser {
  id: string;
  email: string;
  created_at: string;
  invite_code: string | null;
  invite_code_id: string | null;
  access_until: string | null;
  plan_type: PlanType;
}
