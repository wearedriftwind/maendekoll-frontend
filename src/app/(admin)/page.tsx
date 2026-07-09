import { auth, signOut } from "@/lib/auth";

export default async function AdminHome() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Måendekoll — admin
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Inloggad som {session?.user?.name ?? session?.user?.email}.
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
