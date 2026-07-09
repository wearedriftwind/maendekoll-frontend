import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col p-6">
      <nav className="mb-6 flex gap-4 border-b border-black/10 pb-3 dark:border-white/10">
        <Link href="/settings/questions" className="font-medium">
          Frågor
        </Link>
      </nav>
      {children}
    </div>
  );
}
