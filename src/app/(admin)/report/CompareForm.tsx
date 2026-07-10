function toInputValue(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function CompareForm({
  aFrom,
  aTo,
  bFrom,
  bTo,
}: {
  aFrom: Date | null;
  aTo: Date | null;
  bFrom: Date | null;
  bTo: Date | null;
}) {
  return (
    <form
      action="/report"
      className="flex flex-wrap items-end gap-4 rounded-lg border border-black/10 p-4 dark:border-white/10"
    >
      <fieldset className="flex items-end gap-2">
        <legend className="mb-1 w-full text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Period A
        </legend>
        <input
          type="date"
          name="aFrom"
          defaultValue={toInputValue(aFrom)}
          required
          className="rounded border border-black/20 px-2 py-1 text-sm dark:border-white/20 dark:bg-black"
        />
        <span className="text-sm">–</span>
        <input
          type="date"
          name="aTo"
          defaultValue={toInputValue(aTo)}
          required
          className="rounded border border-black/20 px-2 py-1 text-sm dark:border-white/20 dark:bg-black"
        />
      </fieldset>
      <fieldset className="flex items-end gap-2">
        <legend className="mb-1 w-full text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Period B
        </legend>
        <input
          type="date"
          name="bFrom"
          defaultValue={toInputValue(bFrom)}
          required
          className="rounded border border-black/20 px-2 py-1 text-sm dark:border-white/20 dark:bg-black"
        />
        <span className="text-sm">–</span>
        <input
          type="date"
          name="bTo"
          defaultValue={toInputValue(bTo)}
          required
          className="rounded border border-black/20 px-2 py-1 text-sm dark:border-white/20 dark:bg-black"
        />
      </fieldset>
      <button
        type="submit"
        className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
      >
        Jämför perioder
      </button>
    </form>
  );
}
