export type TileType = "seeking" | "offering";

export type FilterCategory = "all" | "activities" | "events" | "sharing" | "everyday";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface FeedItem {
  id: string;
  type: TileType;
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
