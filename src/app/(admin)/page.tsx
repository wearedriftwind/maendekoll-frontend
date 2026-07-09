import { auth, signOut } from "@/lib/auth";
import { apiClient } from "@/lib/apiClient";
import type { Question } from "@/types/questions";

export default async function AdminHome() {
  const session = await auth();
  const questions = await apiClient.get<Question[]>("/questions");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Måendekoll — admin
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Inloggad som {session?.user?.name ?? session?.user?.email}.
      </p>
      <p className="text-zinc-600 dark:text-zinc-400">
        {questions.length} fråga(or) registrerade i bot+API:et.
      </p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="rounded-full border border-black/20 px-5 py-2 text-sm dark:border-white/20"
        >
          Logga ut
        </button>
      </form>
    </div>
  );
}
