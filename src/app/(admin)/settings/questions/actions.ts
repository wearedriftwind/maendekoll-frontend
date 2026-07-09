"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import type { Question } from "@/types/questions";

function stringField(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value : undefined;
}

export async function createQuestion(formData: FormData) {
  const text = stringField(formData, "text");
  if (!text) return;

  await apiClient.post<Question>("/questions", {
    text,
    response_type: stringField(formData, "response_type"),
  });

  revalidatePath("/settings/questions");
}

export async function updateQuestion(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") return;

  await apiClient.patch<Question>(`/questions/${id}`, {
    text: stringField(formData, "text"),
    response_type: stringField(formData, "response_type"),
    active: formData.get("active") === "on",
  });

  revalidatePath("/settings/questions");
}
