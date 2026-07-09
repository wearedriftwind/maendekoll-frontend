"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import type { Question } from "@/types/questions";

function nullableField(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value !== "" ? value : null;
}

export async function updateSchedule(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const weekday = nullableField(formData, "weekday");

  await apiClient.patch<Question & { last_sent_at: string | null }>(
    `/questions/${id}/schedule`,
    {
      frequency: formData.get("frequency"),
      weekday: weekday === null ? null : Number(weekday),
      send_time: nullableField(formData, "send_time"),
      channel_type: formData.get("channel_type"),
    },
  );

  revalidatePath("/settings/questions");
  redirect("/settings/questions");
}
