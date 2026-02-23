import { FormEvent, useEffect, useState } from "react";
import logo from "./assets/logo.svg";

type View = "landing" | "login";
type MeResponse = { username: string };

const INVALID_CREDENTIALS_MESSAGE = "Invalid username or password.";
const GENERIC_LOGIN_MESSAGE = "Login failed. Please try again.";
const NETWORK_MESSAGE = "Cannot reach backend. Check if API is running.";

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

  useEffect(() => {
    const controller = new AbortController();

    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          signal: controller.signal
        });

        if (!response.ok) {
          setMe(null);
          return;
        }

        const payload = (await response.json()) as MeResponse;
        setMe(payload.username);
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

  const onLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        if (response.status === 401) {
          setLoginError(INVALID_CREDENTIALS_MESSAGE);
          return;
        }

        const payload = await response.json().catch(() => null);
        setLoginError(parseErrorMessage(payload) ?? GENERIC_LOGIN_MESSAGE);
        return;
      }

      const payload = (await response.json()) as MeResponse;
      setMe(payload.username);
      setPassword("");
      setView("landing");
    } catch {
      setLoginError(NETWORK_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    }).catch(() => null);

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
    <main className="page page-center">
      <section className="card panel panel-center">
        <img src={logo} alt="Blef logo" width={96} height={96} />
        <h1 className="title title-top">Blef</h1>
        <p className="subtitle">Read faces. Raise the stake. Call the bluff.</p>
        {me !== null ? <p className="status status-ok">Logged in as {me}</p> : null}
        <div className="actions">
          {me === null ? (
            <button className="button primary" type="button" onClick={() => setView("login")}>Login</button>
          ) : (
            <button className="button ghost" type="button" onClick={onLogout}>Logout</button>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
