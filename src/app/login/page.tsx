import { signIn } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Måendekoll — admin
      </h1>
      {error && (
        <p className="max-w-sm text-center text-red-600 dark:text-red-400">
          Du har inte adminbehörighet, eller inloggningen misslyckades.
          Kontakta Thomas eller Lars om du borde ha åtkomst.
        </p>
      )}
      <form
        action={async () => {
          "use server";
          await signIn("slack");
        }}
      >
        <button
          type="submit"
          className="rounded-full bg-black px-6 py-3 font-medium text-white dark:bg-white dark:text-black"
        >
          Logga in med Slack
        </button>
      </form>
    </div>
  );
}
