export interface NoteDto {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NoteCreateDto {
  title: string;
  content: string;
}

/**
 * PUBLIC_INTERFACE
 * Get API base URL.
 * If environment variable is not available, default to relative '/api'.
 * The orchestrator should provide NOTES_API_BASE in the .env file for deployments.
 */
export function getApiBase(): string {
  // Vite exposes env at import.meta.env; Slidev uses Vite underneath.
  const env = (import.meta as any).env || {};
  const base = env.VITE_NOTES_API_BASE || env.NOTES_API_BASE || "/api";
  return String(base);
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getApiBase()}${path}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(init && init.headers ? init.headers : {}),
    },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

/**
 * PUBLIC_INTERFACE
 * Notes REST API helper
 * Expected endpoints:
 *  - GET    /notes
 *  - POST   /notes        { title, content }
 *  - PUT    /notes/:id    { title, content }
 *  - DELETE /notes/:id
 */
export const notesApi = {
  async list(): Promise<NoteDto[]> {
    return http<NoteDto[]>("/notes");
  },

  async create(payload: NoteCreateDto): Promise<NoteDto> {
    return http<NoteDto>("/notes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: NoteCreateDto): Promise<NoteDto> {
    return http<NoteDto>(`/notes/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async remove(id: string): Promise<void> {
    return http<void>(`/notes/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};
