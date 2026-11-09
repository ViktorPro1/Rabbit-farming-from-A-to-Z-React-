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
