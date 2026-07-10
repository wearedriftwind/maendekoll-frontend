"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import type { AdminUser } from "@/types/users";

export async function updateUserActive(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  await apiClient.patch<AdminUser>(`/users/${id}`, {
    active: formData.get("active") === "on",
  });

  revalidatePath("/settings/employees");
}

export async function setEscalationContact(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  await apiClient.patch<AdminUser>(`/users/${id}/escalation-contact`, {});

  revalidatePath("/settings/employees");
}
