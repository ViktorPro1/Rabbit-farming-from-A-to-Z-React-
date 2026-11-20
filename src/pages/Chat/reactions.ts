// Логіка реакцій чату без React: типи, збирання даних із бази,
// миттєве (оптимістичне) оновлення на екрані. Окремо від Chat.tsx,
// щоб це було просто тестувати.

export type ReactionKind = "up" | "down" | "handshake";

export const REACTION_KINDS: readonly ReactionKind[] = [
  "up",
  "down",
  "handshake",
];

export interface ReactionState {
  count: number;
  mine: boolean;
}

// повідомлення -> вид реакції -> кількість і чи є серед них моя
export type ReactionMap = Record<
  string,
  Partial<Record<ReactionKind, ReactionState>>
>;

// Рядок, який віддає функція chat_reaction_counts()
export interface ReactionCountRow {
  message_id: string;
  kind: string;
  cnt: number;
  mine: boolean;
}

function isKind(value: string): value is ReactionKind {
  return (REACTION_KINDS as readonly string[]).includes(value);
}

export function buildReactionMap(rows: ReactionCountRow[]): ReactionMap {
  const map: ReactionMap = {};
  for (const row of rows) {
    if (!isKind(row.kind)) continue; // невідомий вид ігноруємо
    const entry = map[row.message_id] ?? {};
    entry[row.kind] = { count: row.cnt, mine: row.mine };
    map[row.message_id] = entry;
  }
  return map;
}

// Яка моя реакція на повідомленні (або null)
export function myReaction(
  map: ReactionMap,
  messageId: string,
): ReactionKind | null {
  const entry = map[messageId];
  if (!entry) return null;
  for (const kind of REACTION_KINDS) {
    if (entry[kind]?.mine) return kind;
  }
  return null;
}

// Те саме, що зробить база: та сама реакція знімається, інша замінює мою.
// Повертає нову мапу, стару не змінює.
export function toggleReactionLocally(
  map: ReactionMap,
  messageId: string,
  kind: ReactionKind,
): ReactionMap {
  const current = myReaction(map, messageId);
  const entry: Partial<Record<ReactionKind, ReactionState>> = {
    ...map[messageId],
  };

  // зняти попередню мою реакцію
  if (current) {
    const prev = entry[current];
    const left = Math.max(0, (prev?.count ?? 1) - 1);
    if (left === 0) delete entry[current];
    else entry[current] = { count: left, mine: false };
  }

  // поставити нову, якщо це не повторний клік по тій самій
  if (current !== kind) {
    const prev = entry[kind];
    entry[kind] = { count: (prev?.count ?? 0) + 1, mine: true };
  }

  return { ...map, [messageId]: entry };
}
