import { apiRequest } from "./http";

export type MeResponse = { username: string };

type LoginRequest = { username: string; password: string };

export const getMe = (signal?: AbortSignal) =>
  apiRequest<MeResponse>("/api/auth/me", {
    method: "GET",
    signal
  });

export const login = (payload: LoginRequest) =>
  apiRequest<MeResponse>("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

export const logout = () =>
  apiRequest<void>("/api/auth/logout", {
    method: "POST"
  });
