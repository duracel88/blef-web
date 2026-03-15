import { FormEvent, useCallback, useEffect, useState } from "react";
import { getMe, login, logout } from "./api/authApi";
import { createGame, getOpenGames } from "./api/lobbyApi";
import logo from "./assets/logo.svg";
import { useLobbySocket } from "./hooks/useLobbySocket";
import type { CreateGameRequest, OpenRegistrationResponse } from "./types/lobby";
import LobbyView from "./views/LobbyView";

type View = "landing" | "login";
const INVALID_CREDENTIALS_MESSAGE = "Invalid username or password.";
const GENERIC_LOGIN_MESSAGE = "Login failed. Please try again.";
const NETWORK_MESSAGE = "Cannot reach backend. Check if API is running.";
const GENERIC_CREATE_GAME_MESSAGE = "Create game failed. Please try again.";
const GENERIC_GAMES_MESSAGE = "Cannot load games. Please refresh.";
const NETWORK_GAMES_MESSAGE = "Cannot reach backend while loading games.";

function parseErrorMessage(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const maybeMessage = (payload as { message?: unknown }).message;

  return typeof maybeMessage === "string" && maybeMessage.trim() !== "" ? maybeMessage : null;
}

function App() {
  const [view, setView] = useState<View>("landing");
  const [username, setUsername] = useState("p1");
  const [password, setPassword] = useState("secret123");
  const [me, setMe] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [games, setGames] = useState<OpenRegistrationResponse[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const { joinedUsers } = useLobbySocket(me);

  const loadGames = useCallback(async (signal?: AbortSignal) => {
    setIsLoadingGames(true);

    try {
      const result = await getOpenGames(signal);

      if (!result.ok || result.data === null || !Array.isArray(result.data)) {
        setGamesError(GENERIC_GAMES_MESSAGE);
        setGames([]);
        return GENERIC_GAMES_MESSAGE;
      }

      setGames(result.data);
      setGamesError(null);
      return null;
    } catch {
      setGamesError(NETWORK_GAMES_MESSAGE);
      setGames([]);
      return NETWORK_GAMES_MESSAGE;
    } finally {
      setIsLoadingGames(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadSession = async () => {
      try {
        const result = await getMe(controller.signal);

        if (!result.ok || result.data === null) {
          setMe(null);
          return;
        }

        setMe(result.data.username);
      } catch {
        setMe(null);
      } finally {
        setIsCheckingSession(false);
      }
    };

    void loadSession();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (me === null) {
      setGames([]);
      setGamesError(null);
      setIsLoadingGames(false);
      return;
    }

    const controller = new AbortController();
    void loadGames(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadGames, me]);

  const onLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const result = await login({ username, password });

      if (!result.ok) {
        if (result.status === 401) {
          setLoginError(INVALID_CREDENTIALS_MESSAGE);
          return;
        }

        setLoginError(parseErrorMessage(result.data) ?? GENERIC_LOGIN_MESSAGE);
        return;
      }

      if (result.data === null) {
        setLoginError(GENERIC_LOGIN_MESSAGE);
        return;
      }

      setMe(result.data.username);
      setPassword("");
      setView("landing");
    } catch {
      setLoginError(NETWORK_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCreateGame = useCallback(async (payload: CreateGameRequest) => {
    try {
      const result = await createGame(payload);

      if (!result.ok) {
        return parseErrorMessage(result.data) ?? GENERIC_CREATE_GAME_MESSAGE;
      }

      if (result.data === null) {
        return GENERIC_CREATE_GAME_MESSAGE;
      }

      return await loadGames();
    } catch {
      return NETWORK_MESSAGE;
    }
  }, [loadGames]);

  const onLogout = async () => {
    await logout().catch(() => null);

    setMe(null);
    setView("landing");
    setLoginError(null);
  };

  if (isCheckingSession) {
    return (
      <main className="page page-center page-narrow">
        <section className="card panel panel-wide">
          <div className="brand margin-bottom-sm">
            <img src={logo} alt="Blef logo" />
            <span>Blef</span>
          </div>
          <p className="muted">Checking session...</p>
        </section>
      </main>
    );
  }

  if (view === "login" && me === null) {
    return (
      <main className="page page-center page-narrow">
        <section className="card panel panel-wide">
          <div className="brand margin-bottom-sm">
            <img src={logo} alt="Blef logo" />
            <span>Blef / Login</span>
          </div>

          <form onSubmit={onLoginSubmit}>
            <div className="form-row">
              <label className="label" htmlFor="username">Username</label>
              <input
                className="input"
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-row form-row-last">
              <label className="label" htmlFor="password">Password</label>
              <input
                className="input"
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>

            {loginError !== null ? <p className="status status-error">{loginError}</p> : null}

            <button className="button primary button-block" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <button className="button ghost margin-top-sm" type="button" onClick={() => setView("landing")} disabled={isSubmitting}>Back</button>
        </section>
      </main>
    );
  }

  return (
    <main className={me === null ? "page page-center" : "page lobby-page"}>
      {me === null ? (
        <section className="card panel panel-center">
          <img src={logo} alt="Blef logo" width={96} height={96} />
          <h1 className="title title-top">Blef</h1>
          <p className="subtitle">Read faces. Raise the stake. Call the bluff.</p>
          <div className="actions">
            <button className="button primary" type="button" onClick={() => setView("login")}>Login</button>
          </div>
        </section>
      ) : (
        <LobbyView
          me={me}
          joinedUsers={joinedUsers}
          games={games}
          isLoadingGames={isLoadingGames}
          gamesError={gamesError}
          onCreateGame={onCreateGame}
          onLogout={onLogout}
        />
      )}
    </main>
  );
}

export default App;
