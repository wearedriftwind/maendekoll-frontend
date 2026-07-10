"use server";

import { revalidatePath } from "next/cache";
import { apiClient, ApiError } from "@/lib/apiClient";
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

export type SendNowState =
  | { status: "idle" }
  | { status: "success"; sentTo: number }
  | { status: "error"; message: string };

export async function sendQuestionNow(
  _prevState: SendNowState,
  formData: FormData,
): Promise<SendNowState> {
  const text = stringField(formData, "text");
  if (!text) return { status: "error", message: "Text saknas." };

  try {
    const result = await apiClient.post<{
      question_id: string;
      sent_to: number;
    }>("/questions/send-now", {
      text,
      response_type: stringField(formData, "response_type"),
    });

    revalidatePath("/settings/questions");
    return { status: "success", sentTo: result.sent_to };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof ApiError ? err.message : "Kunde inte skicka frågan.",
    };
  }
}
