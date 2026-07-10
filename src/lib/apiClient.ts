import "server-only";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function baseUrl(): string {
  const url = process.env.MAENDEKOLL_API_URL;
  if (!url) throw new Error("MAENDEKOLL_API_URL saknas.");
  return url;
}

function withDataset(path: string): string {
  if (process.env.MAENDEKOLL_INCLUDE_TEST_DATA !== "true") return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}dataset=all`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, body.error ?? "Okänt fel från API:et.");
  }

  return res.json();
}

export const apiClient = {
  get: <T>(path: string) => request<T>(withDataset(path)),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};
