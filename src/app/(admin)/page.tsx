import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Måendekoll — admin
      </h1>
      <div className="flex gap-4">
        <Link
          href="/report"
          className="rounded-lg border border-black/10 px-8 py-6 text-center font-medium dark:border-white/10"
        >
          Rapport
        </Link>
        <Link
          href="/settings"
          className="rounded-lg border border-black/10 px-8 py-6 text-center font-medium dark:border-white/10"
        >
          Inställningar
        </Link>
      </div>
    </div>
  );
}
