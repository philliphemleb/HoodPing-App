export type CardType = "seeking" | "offering";

export interface PhonePrefix {
  code: string;
  label: string;
}

export type FilterCategory = "all" | "activities" | "events" | "sharing" | "everyday";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface FeedItem {
  id: string;
  type: CardType;
  category: FilterCategory;
  categoryIcon: string;
  title: string;
  authorName: string;
  distance: string;
  timeLeft: string;
  imageUrl?: string;
  badge?: string;
  visibleFor?: string;
  shareWith?: string;
}
