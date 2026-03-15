import { apiRequest } from "./http";
import type {
  CreateGameRequest,
  CreateGameResponse,
  LobbyUsersResponse,
  OpenRegistrationResponse
} from "../types/lobby";

export const getLoggedUsers = (signal?: AbortSignal) =>
  apiRequest<LobbyUsersResponse>("/api/lobby/users", {
    method: "GET",
    signal
  });

export const getOpenGames = (signal?: AbortSignal) =>
  apiRequest<OpenRegistrationResponse[]>("/api/games", {
    method: "GET",
    signal
  });

export const createGame = (payload: CreateGameRequest) =>
  apiRequest<CreateGameResponse>("/api/games", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
