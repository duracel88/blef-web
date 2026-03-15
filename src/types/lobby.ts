export type LobbyEvent = {
  type?: "USER_LOGGED_IN" | "USER_LOGGED_OUT";
  username: string;
  occurredAt: string;
};

export type LobbyUsersResponse = {
  users: string[];
};

export type CreateGameRequest = {
  maxPlayers: number;
  totalTimeBankSeconds: number;
};

export type CreateGameResponse = {
  gameId: string;
  status: string;
  maxPlayers: number;
  totalTimeBankSeconds: number;
};

export type OpenRegistrationResponse = {
  gameId: string;
  status: string;
  playersCount: number;
  maxPlayers: number;
  totalTimeBankSeconds: number;
  players: string[];
};
