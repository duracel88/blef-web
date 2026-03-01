import { apiRequest } from "./http";
import type { LobbyUsersResponse } from "../types/lobby";

export const getLoggedUsers = (signal?: AbortSignal) =>
  apiRequest<LobbyUsersResponse>("/api/lobby/users", {
    method: "GET",
    signal
  });
