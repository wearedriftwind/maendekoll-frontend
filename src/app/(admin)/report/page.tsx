import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import type { AggregateStats, ChartPoint, ChartSeries } from "@/types/stats";
import { CompareForm } from "./CompareForm";
import { TrendChart } from "./TrendChart";

const MAX_MONTHS = 24;
const COMPARE_BUCKETS = 8;
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

function equalBuckets(from: Date, to: Date, count: number): { from: Date; to: Date }[] {
  const bucketMs = (to.getTime() - from.getTime()) / count;
  return Array.from({ length: count }, (_, i) => ({
    from: new Date(from.getTime() + i * bucketMs),
    to: new Date(from.getTime() + (i + 1) * bucketMs),
  }));
}

function parseDate(value: string | string[] | undefined): Date | null {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function endOfDay(date: Date): Date {
  return new Date(date.getTime() + 24 * 60 * 60 * 1000);
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short", year: "numeric" });
}

async function fetchAggregate(from: Date, to: Date): Promise<AggregateStats> {
  return apiClient.get<AggregateStats>(
    `/stats/aggregate?from=${from.toISOString()}&to=${to.toISOString()}`,
  );
}

async function renderFullHistory() {
  const responses = await apiClient.get<ResponseRow[]>("/responses");

  if (responses.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        Inga svar registrerade än.
      </p>
    );
  }

  const earliest = new Date(
    Math.min(...responses.map((response) => new Date(response.createdAt).getTime())),
  );
  const windows = monthWindows(earliest, new Date());

  const data: ChartPoint[] = await Promise.all(
    windows.map(async ({ label, from, to }) => ({
      label,
      averageEmoji: (await fetchAggregate(from, to)).averageEmoji,
    })),
  );

  const series: ChartSeries[] = [
    { key: "averageEmoji", label: "Snittmående", color: "#4f46e5" },
  ];

  return (
    <>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Snittmående per månad, sedan första registrerade svaret.
      </p>
      <TrendChart data={data} series={series} />
    </>
  );
}

async function renderCompare(aFrom: Date, aTo: Date, bFrom: Date, bTo: Date) {
  const bucketsA = equalBuckets(aFrom, aTo, COMPARE_BUCKETS);
  const bucketsB = equalBuckets(bFrom, bTo, COMPARE_BUCKETS);

  const [statsA, statsB] = await Promise.all([
    Promise.all(bucketsA.map(({ from, to }) => fetchAggregate(from, to))),
    Promise.all(bucketsB.map(({ from, to }) => fetchAggregate(from, to))),
  ]);

  const data: ChartPoint[] = Array.from({ length: COMPARE_BUCKETS }, (_, i) => ({
    label: `${i + 1}`,
    periodA: statsA[i].averageEmoji,
    periodB: statsB[i].averageEmoji,
  }));

  const series: ChartSeries[] = [
    { key: "periodA", label: `A: ${formatDateLabel(aFrom)} – ${formatDateLabel(aTo)}`, color: "#4f46e5" },
    { key: "periodB", label: `B: ${formatDateLabel(bFrom)} – ${formatDateLabel(bTo)}`, color: "#f97316" },
  ];

  return (
    <>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Jämför två perioder, båda delade i {COMPARE_BUCKETS} lika delar på en
        relativ tidsaxel (punkt 1–{COMPARE_BUCKETS} inom respektive period).
      </p>
      <TrendChart data={data} series={series} />
      <Link href="/report" className="self-start text-sm underline">
        Visa hela historiken
      </Link>
    </>
  );
}

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const aFrom = parseDate(params.aFrom);
  const aTo = parseDate(params.aTo);
  const bFrom = parseDate(params.bFrom);
  const bTo = parseDate(params.bTo);

  const comparing = Boolean(aFrom && aTo && bFrom && bTo);
  const invalidRange =
    comparing && (aFrom!.getTime() >= aTo!.getTime() || bFrom!.getTime() >= bTo!.getTime());

  let content: React.ReactNode;
  if (invalidRange) {
    content = (
      <p className="text-zinc-600 dark:text-zinc-400">
        Både period A och period B måste ha ett startdatum före slutdatumet.
      </p>
    );
  } else if (comparing) {
    content = await renderCompare(aFrom!, endOfDay(aTo!), bFrom!, endOfDay(bTo!));
  } else {
    content = await renderFullHistory();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
        Trendgraf
      </h1>
      <CompareForm aFrom={aFrom} aTo={aTo} bFrom={bFrom} bTo={bTo} />
      {content}
    </div>
  );
}
