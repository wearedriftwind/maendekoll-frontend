import { notFound } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import type { Question } from "@/types/questions";
import { updateSchedule } from "./actions";

const FREQUENCIES = [
  { value: "weekly", label: "Veckovis" },
  { value: "biweekly", label: "Varannan vecka" },
  { value: "monthly", label: "Månadsvis" },
];

const WEEKDAYS = [
  { value: "0", label: "Söndag" },
  { value: "1", label: "Måndag" },
  { value: "2", label: "Tisdag" },
  { value: "3", label: "Onsdag" },
  { value: "4", label: "Torsdag" },
  { value: "5", label: "Fredag" },
  { value: "6", label: "Lördag" },
];

const CHANNEL_TYPES = [
  { value: "dm", label: "DM till varje anställd" },
  { value: "channel", label: "Gemensam kanal" },
];

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const questions = await apiClient.get<
    (Question & { last_sent_at?: string | null })[]
  >("/questions");
  const question = questions.find((q) => q.id === id);
  if (!question) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
        Schema — {question.text}
      </h1>

      {question.last_sent_at && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Senast skickad: {new Date(question.last_sent_at).toLocaleString("sv-SE")}
        </p>
      )}

      <form
        action={updateSchedule}
        className="flex flex-col gap-4 rounded-lg border border-black/10 p-4 dark:border-white/10"
      >
        <input type="hidden" name="id" value={question.id} />

        <label className="flex flex-col gap-1 text-sm">
          Frekvens
          <select
            name="frequency"
            defaultValue={question.frequency ?? ""}
            className="rounded border border-black/20 px-3 py-2 dark:border-white/20 dark:bg-black"
          >
            <option value="" disabled>
              Välj frekvens
            </option>
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Veckodag
          <select
            name="weekday"
            defaultValue={question.weekday?.toString() ?? ""}
            className="rounded border border-black/20 px-3 py-2 dark:border-white/20 dark:bg-black"
          >
            <option value="">Inte satt</option>
            {WEEKDAYS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tid
          <input
            type="time"
            name="send_time"
            defaultValue={question.send_time?.slice(0, 5) ?? ""}
            className="rounded border border-black/20 px-3 py-2 dark:border-white/20 dark:bg-black"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Kanal
          <select
            name="channel_type"
            defaultValue={question.channel_type ?? ""}
            className="rounded border border-black/20 px-3 py-2 dark:border-white/20 dark:bg-black"
          >
            <option value="" disabled>
              Välj kanaltyp
            </option>
            {CHANNEL_TYPES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="self-start rounded-full bg-black px-5 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Spara schema
        </button>
      </form>
    </div>
  );
}
