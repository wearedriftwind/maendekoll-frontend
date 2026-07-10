"use client";

import { useActionState } from "react";
import { sendQuestionNow, type SendNowState } from "./actions";

const RESPONSE_TYPES = ["both", "emoji", "text"];

const initialState: SendNowState = { status: "idle" };

export function SendNowForm() {
  const [state, formAction, pending] = useActionState(
    sendQuestionNow,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/10"
    >
      <h2 className="font-medium">Skicka en fråga direkt</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Skapar en ny fråga och skickar den direkt till alla aktiva anställda.
      </p>
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
        disabled={pending}
        className="self-start rounded-full bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {pending ? "Skickar…" : "Skicka nu"}
      </button>
      {state.status === "success" && (
        <p className="text-sm text-green-700 dark:text-green-400">
          Skickades till {state.sentTo} anställda.
        </p>
      )}
      {state.status === "error" && (
        <p className="text-sm text-red-700 dark:text-red-400">
          {state.message}
        </p>
      )}
    </form>
  );
}
