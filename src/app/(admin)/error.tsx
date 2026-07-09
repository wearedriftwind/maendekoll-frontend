"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-black">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
        Något gick fel
      </h1>
      <p className="max-w-sm text-center text-zinc-600 dark:text-zinc-400">
        Kunde inte hämta data från bot-API:et just nu. Försök igen om en
        stund, eller kontakta Thomas eller Lars om det upprepas.
      </p>
      <button
        onClick={reset}
        className="rounded-full border border-black/20 px-5 py-2 text-sm dark:border-white/20"
      >
        Försök igen
      </button>
    </div>
  );
}
