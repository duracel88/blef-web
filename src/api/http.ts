export type ApiResponse<T> = {
  ok: boolean;
  status: number;
  data: T | null;
};

export const apiRequest = async <T>(input: RequestInfo, init: RequestInit = {}): Promise<ApiResponse<T>> => {
  const response = await fetch(input, {
    credentials: "include",
    ...init
  });

  let data: T | null = null;

  if (response.status !== 204) {
    data = await response.json().catch(() => null);
  }

  return {
    ok: response.ok,
    status: response.status,
    data
  };
};
