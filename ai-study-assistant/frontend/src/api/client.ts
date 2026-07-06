const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export type AuthPayload = {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

export const api = {
  signup: (payload: { name: string; email: string; password: string }) =>
    request<AuthPayload>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    request<AuthPayload>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  documents: () => request<Array<Record<string, string>>>("/documents"),
  recentChats: () => request<Array<Record<string, string>>>("/chat/recent"),
  sendMessage: (message: string) =>
    request<{ answer: string; sources: Array<Record<string, string>> }>("/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  generateSummary: () =>
    request<{ summary: string[] }>("/summaries", {
      method: "POST",
      body: JSON.stringify({}),
    }),
  generateFlashcards: () =>
    request<Array<{ id: string; front: string; back: string }>>("/flashcards/generate", {
      method: "POST",
      body: JSON.stringify({}),
    }),
  generateQuiz: () =>
    request<{ questions: Array<Record<string, unknown>> }>("/quizzes/generate", {
      method: "POST",
      body: JSON.stringify({}),
    }),
};

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/documents`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(error.detail ?? "Upload failed");
  }

  return response.json() as Promise<{ id: string; filename: string; characters: number; status: string }>;
}

