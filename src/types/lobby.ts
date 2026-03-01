export type LobbyEvent = {
  type?: "USER_LOGGED_IN" | "USER_LOGGED_OUT";
  username: string;
  occurredAt: string;
};

export type LobbyUsersResponse = {
  users: string[];
};
