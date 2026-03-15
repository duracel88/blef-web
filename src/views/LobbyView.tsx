import { type FormEvent, useMemo, useState } from "react";
import logo from "../assets/logo.svg";
import PlayersList from "../components/lobby/PlayersList";
import type { CreateGameRequest, OpenRegistrationResponse } from "../types/lobby";

type LobbyViewProps = {
  me: string;
  joinedUsers: { name: string; status: "active" | "leaving" }[];
  games: OpenRegistrationResponse[];
  isLoadingGames: boolean;
  gamesError: string | null;
  onCreateGame: (payload: CreateGameRequest) => Promise<string | null>;
  onLogout: () => void;
};

const LobbyView = ({
  me,
  joinedUsers,
  games,
  isLoadingGames,
  gamesError,
  onCreateGame,
  onLogout
}: LobbyViewProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [maxPlayers, setMaxPlayers] = useState("4");
  const [moveTimeSeconds, setMoveTimeSeconds] = useState("60");
  const tabs = [
    { id: "all", label: "All games" },
    { id: "pending", label: "Pending games" },
    { id: "awaiting", label: "Awaiting games" }
  ] as const;

  const awaitingGames = useMemo(
    () => games.filter((game) => game.status === "CREATED"),
    [games]
  );

  const pendingGames = useMemo(
    () => games.filter((game) => game.status === "STARTED"),
    [games]
  );

  const visibleGames = useMemo(() => {
    if (activeTab === "all") {
      return games;
    }

    if (activeTab === "pending") {
      return pendingGames;
    }

    return awaitingGames;
  }, [activeTab, awaitingGames, games, pendingGames]);

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedMaxPlayers = Number.parseInt(maxPlayers, 10);
    const parsedMoveTimeSeconds = Number.parseInt(moveTimeSeconds, 10);

    if (!Number.isInteger(parsedMaxPlayers) || parsedMaxPlayers < 2 || parsedMaxPlayers > 4) {
      setCreateError("Maximum players must be 2, 3 or 4.");
      return;
    }

    if (!Number.isInteger(parsedMoveTimeSeconds) || parsedMoveTimeSeconds <= 0) {
      setCreateError("Move time must be a positive number.");
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    const error = await onCreateGame({
      maxPlayers: parsedMaxPlayers,
      totalTimeBankSeconds: parsedMoveTimeSeconds
    });

    if (error !== null) {
      setCreateError(error);
      setIsCreating(false);
      return;
    }

    setIsCreating(false);
    setIsCreatePanelOpen(false);
    setMaxPlayers("4");
    setMoveTimeSeconds("60");
  };

  const handleOpenCreatePanel = () => {
    setCreateError(null);
    setIsCreatePanelOpen(true);
  };

  const handleCloseCreatePanel = () => {
    setCreateError(null);
    setIsCreatePanelOpen(false);
  };

  return (
    <section className="card lobby-shell">
      <header className="lobby-header">
        <div className="brand">
          <img src={logo} alt="Blef logo" />
          <span>Lobby</span>
        </div>
        <div className="lobby-actions">
          <p className="status status-ok">Logged in as {me}</p>
          <button className="button ghost" type="button" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="lobby-grid">
        <section className="lobby-pane lobby-main">
          <div className="lobby-games-header">
            <div className="lobby-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`lobby-tab${activeTab === tab.id ? " is-active" : ""}`}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button className="button ghost lobby-add" type="button" onClick={handleOpenCreatePanel}>
              +
            </button>
          </div>

          {isCreatePanelOpen ? (
            <form className="lobby-create-panel" onSubmit={handleCreateSubmit}>
              <div className="lobby-create-head">
                <div>
                  <h3 className="lobby-create-title">Create game</h3>
                  <p className="subtitle">Fill in basic game settings.</p>
                </div>
                <button className="button ghost" type="button" onClick={handleCloseCreatePanel}>
                  Cancel
                </button>
              </div>
              <div className="lobby-create-grid">
                <div className="form-row">
                  <label className="label" htmlFor="maxPlayers">Maximum players</label>
                  <input
                    className="input"
                    id="maxPlayers"
                    name="maxPlayers"
                    type="number"
                    min={2}
                    max={4}
                    value={maxPlayers}
                    onChange={(event) => setMaxPlayers(event.target.value)}
                    disabled={isCreating}
                  />
                </div>
                <div className="form-row">
                  <label className="label" htmlFor="moveTimeSeconds">Move time (seconds)</label>
                  <input
                    className="input"
                    id="moveTimeSeconds"
                    name="moveTimeSeconds"
                    type="number"
                    min={10}
                    max={600}
                    value={moveTimeSeconds}
                    onChange={(event) => setMoveTimeSeconds(event.target.value)}
                    disabled={isCreating}
                  />
                </div>
              </div>
              {createError !== null ? <p className="status status-error">{createError}</p> : null}
              <div className="lobby-create-actions">
                <button className="button primary" type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create game"}
                </button>
              </div>
            </form>
          ) : (
            <div className="lobby-tab-panel">
              {gamesError !== null ? <p className="status status-error">{gamesError}</p> : null}
              {isLoadingGames ? <p className="subtitle">Loading games...</p> : null}
              {!isLoadingGames && gamesError === null && visibleGames.length === 0 ? (
                <p className="subtitle">No games in this view.</p>
              ) : null}
              {!isLoadingGames && gamesError === null && visibleGames.length > 0 ? (
                <ul className="lobby-games-list">
                  {visibleGames.map((game) => (
                    <li key={game.gameId} className="lobby-game-item">
                      <div className="lobby-game-row">
                        <span className="lobby-game-id">{game.gameId.slice(0, 8)}</span>
                        <span className="lobby-game-status">{game.status}</span>
                      </div>
                      <div className="lobby-game-row muted">
                        <span>{game.playersCount}/{game.maxPlayers} players</span>
                        <span>{game.totalTimeBankSeconds}s</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </section>

        <aside className="lobby-pane lobby-sidebar">
          <h3 className="lobby-side-title">Players</h3>
          <PlayersList users={joinedUsers} />
        </aside>
      </div>
    </section>
  );
};

export default LobbyView;
