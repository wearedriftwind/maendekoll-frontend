import { apiClient } from "@/lib/apiClient";
import type { AdminUser } from "@/types/users";
import { setEscalationContact, updateUserActive } from "./actions";
import { AutoSubmitCheckbox } from "./AutoSubmitCheckbox";

export default async function EmployeesPage() {
  const users = await apiClient.get<AdminUser[]>("/users");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
        Anställda
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Pausa eller aktivera anställda, och välj vem som ska vara
        eskalationskontakt. Endast en person kan vara eskalationskontakt åt
        gången — att kryssa en ny ersätter den föregående.
      </p>

      <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 dark:border-white/10">
            <tr>
              <th className="px-4 py-2 font-medium">Namn</th>
              <th className="px-4 py-2 font-medium">Roll</th>
              <th className="px-4 py-2 font-medium">Aktiv</th>
              <th className="px-4 py-2 font-medium">Eskalationskontakt</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-black/5 last:border-0 dark:border-white/5"
              >
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  <AutoSubmitCheckbox
                    action={updateUserActive}
                    id={user.id}
                    name="active"
                    defaultChecked={user.active}
                    ariaLabel={`Aktiv: ${user.name}`}
                  />
                </td>
                <td className="px-4 py-2">
                  <AutoSubmitCheckbox
                    action={setEscalationContact}
                    id={user.id}
                    name="escalation_contact"
                    defaultChecked={user.is_escalation_contact}
                    ariaLabel={`Eskalationskontakt: ${user.name}`}
                  />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-zinc-600 dark:text-zinc-400"
                >
                  Inga anställda registrerade än.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
