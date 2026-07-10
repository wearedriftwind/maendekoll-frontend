export interface AggregateStats {
  totalResponses: number;
  responsesWithEmoji: number;
  responsesWithoutEmoji: number;
  averageEmoji: number | null;
  distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
}

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
}

export type ChartPoint = Record<string, string | number | null>;
