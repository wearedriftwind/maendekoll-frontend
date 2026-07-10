import Link from "next/link";

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col p-6">
      <nav className="mb-6 flex gap-4 border-b border-black/10 pb-3 dark:border-white/10">
        <Link href="/report" className="font-medium">
          Trendgraf
        </Link>
        <Link href="/report/responses" className="font-medium">
          Svarslogg
        </Link>
      </nav>
      {children}
    </div>
  );
}
