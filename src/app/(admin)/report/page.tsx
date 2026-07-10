import { apiClient } from "@/lib/apiClient";
import type { AggregateStats, TrendPoint } from "@/types/stats";
import { TrendChart } from "./TrendChart";

const MAX_MONTHS = 24;
const MONTH_LABELS = [
  "jan", "feb", "mar", "apr", "maj", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec",
];

interface ResponseRow {
  createdAt: string;
}

function totalMonths(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

function monthWindows(earliest: Date, now: Date): { label: string; from: Date; to: Date }[] {
  const span = Math.min(totalMonths(now) - totalMonths(earliest) + 1, MAX_MONTHS);
  const startTotalMonths = totalMonths(now) - span + 1;
  const windows = [];

  for (let i = 0; i < span; i++) {
    const totalMonth = startTotalMonths + i;
    const year = Math.floor(totalMonth / 12);
    const month = totalMonth % 12;
    const from = new Date(year, month, 1);
    const to = new Date(year, month + 1, 1);
    windows.push({ label: `${MONTH_LABELS[from.getMonth()]} ${from.getFullYear()}`, from, to });
  }

  return windows;
}

export default async function ReportPage() {
  const responses = await apiClient.get<ResponseRow[]>("/responses");

  if (responses.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
          Trendgraf
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Inga svar registrerade än.
        </p>
      </div>
    );
  }

  const earliest = new Date(
    Math.min(...responses.map((response) => new Date(response.createdAt).getTime())),
  );
  const windows = monthWindows(earliest, new Date());

  const points: TrendPoint[] = await Promise.all(
    windows.map(async ({ label, from, to }) => {
      const stats = await apiClient.get<AggregateStats>(
        `/stats/aggregate?from=${from.toISOString()}&to=${to.toISOString()}`,
      );
      return {
        label,
        averageEmoji: stats.averageEmoji,
        totalResponses: stats.totalResponses,
      };
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
        Trendgraf
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Snittmående per månad, sedan första registrerade svaret.
      </p>
      <TrendChart data={points} />
    </div>
  );
}
