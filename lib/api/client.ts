// ============================================================
// Typed HTTP client for the Rail Management backend
// ============================================================

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "/pea-railmanagement-api/api/v1";

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown,
  ) {
    super(`API ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, res.statusText, body);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function headers(extra?: HeadersInit): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extra,
  };
}

export const api = {
  get<T>(path: string, query?: Record<string, string>): Promise<T> {
    let url = `${BASE_URL}${path}`;
    if (query) {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== "") params.set(k, v);
      });
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }
    return fetch(url, { headers: headers() }).then(
      handleResponse<T>,
    );
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: headers(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>);
  },

  put<T>(path: string, body: unknown): Promise<T> {
    return fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(body),
    }).then(handleResponse<T>);
  },

  patch<T>(path: string, body: unknown): Promise<T> {
    return fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(body),
    }).then(handleResponse<T>);
  },

  delete<T>(path: string): Promise<T> {
    return fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: headers(),
    }).then(handleResponse<T>);
  },

  /** Multipart upload (for spreadsheet) */
  upload<T>(path: string, file: File): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    }).then(handleResponse<T>);
  },
} as const;

export { ApiError };
