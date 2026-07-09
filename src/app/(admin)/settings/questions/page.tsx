import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import type { Question } from "@/types/questions";
import { createQuestion, updateQuestion } from "./actions";

const RESPONSE_TYPES = ["both", "emoji", "text"];

export default async function QuestionsPage() {
  const questions = await apiClient.get<Question[]>("/questions");

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
        Frågor
      </h1>

      <form
        action={createQuestion}
        className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/10"
      >
        <h2 className="font-medium">Ny fråga</h2>
        <input
          type="text"
          name="text"
          placeholder="Hur mår du idag?"
          required
          className="rounded border border-black/20 px-3 py-2 dark:border-white/20 dark:bg-black"
        />
        <select
          name="response_type"
          defaultValue="both"
          className="rounded border border-black/20 px-3 py-2 dark:border-white/20 dark:bg-black"
        >
          {RESPONSE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="self-start rounded-full bg-black px-5 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Skapa fråga
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {questions.map((question) => (
          <form
            key={question.id}
            action={updateQuestion}
            className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/10"
          >
            <input type="hidden" name="id" value={question.id} />
            <input
              type="text"
              name="text"
              defaultValue={question.text}
              required
              className="rounded border border-black/20 px-3 py-2 dark:border-white/20 dark:bg-black"
            />
            <select
              name="response_type"
              defaultValue={question.response_type}
              className="rounded border border-black/20 px-3 py-2 dark:border-white/20 dark:bg-black"
            >
              {RESPONSE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="active"
                defaultChecked={question.active}
              />
              Aktiv
            </label>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-full border border-black/20 px-5 py-2 text-sm dark:border-white/20"
              >
                Spara
              </button>
              <Link
                href={`/settings/questions/${question.id}/schedule`}
                className="text-sm underline"
              >
                Schema
              </Link>
            </div>
          </form>
        ))}
        {questions.length === 0 && (
          <p className="text-zinc-600 dark:text-zinc-400">
            Inga frågor registrerade än.
          </p>
        )}
      </div>
    </div>
  );
}
