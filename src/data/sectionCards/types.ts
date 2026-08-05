export interface Card {
  icon: string;
  title: string;
  desc: string;
  path: string;
  keywords: string[];
  external?: boolean;
}

export interface Group {
  groupTitle: string;
  groupIcon: string;
  cards: Card[];
}
