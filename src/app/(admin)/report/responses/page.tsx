import { apiClient } from "@/lib/apiClient";
import type { ResponseEntry } from "@/types/responses";

const MOOD_EMOJI: Record<number, string> = {
  1: "😞",
  2: "🙁",
  3: "😐",
  4: "🙂",
  5: "😄",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("sv-SE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function ResponsesPage() {
  const responses = await apiClient.get<ResponseEntry[]>("/responses");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
        Svarslogg
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Samtliga svar, nyast först.
      </p>

      <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 dark:border-white/10">
            <tr>
              <th className="px-4 py-2 font-medium">Datum</th>
              <th className="px-4 py-2 font-medium">Namn</th>
              <th className="px-4 py-2 font-medium">Mående</th>
              <th className="px-4 py-2 font-medium">Fritext</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr
                key={`${response.userName}-${response.createdAt}`}
                className="border-b border-black/5 last:border-0 dark:border-white/5"
              >
                <td className="whitespace-nowrap px-4 py-2">
                  {formatDate(response.createdAt)}
                </td>
                <td className="px-4 py-2">{response.userName}</td>
                <td className="px-4 py-2 text-lg">
                  {response.emojiValue !== null
                    ? MOOD_EMOJI[response.emojiValue] ?? response.emojiValue
                    : "–"}
                </td>
                <td className="px-4 py-2">{response.freeText ?? "–"}</td>
              </tr>
            ))}
            {responses.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-zinc-600 dark:text-zinc-400"
                >
                  Inga svar registrerade än.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
