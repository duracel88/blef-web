import { type FormEvent, useState } from "react";
import logo from "../assets/logo.svg";
import PlayersList from "../components/lobby/PlayersList";

type LobbyViewProps = {
  me: string;
  joinedUsers: { name: string; status: "active" | "leaving" }[];
  onLogout: () => void;
};

const LobbyView = ({ me, joinedUsers, onLogout }: LobbyViewProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState("6");
  const [moveTimeSeconds, setMoveTimeSeconds] = useState("60");
  const tabs = [
    { id: "all", label: "All games" },
    { id: "pending", label: "Pending games" },
    { id: "awaiting", label: "Awaiting games" },
  ];

  const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
            <button
              className="button ghost lobby-add"
              type="button"
              onClick={() => setIsCreatePanelOpen(true)}
            >
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
                <button
                  className="button ghost"
                  type="button"
                  onClick={() => setIsCreatePanelOpen(false)}
                >
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
                    max={12}
                    value={maxPlayers}
                    onChange={(event) => setMaxPlayers(event.target.value)}
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
                  />
                </div>
              </div>
              <div className="lobby-create-actions">
                <button className="button primary" type="submit">Create game</button>
              </div>
            </form>
          ) : (
            <div className="lobby-tab-panel">
              {activeTab === "all" ? (
                <p className="subtitle">All games view.</p>
              ) : activeTab === "pending" ? (
                <p className="subtitle">Pending games view.</p>
              ) : (
                <p className="subtitle">Awaiting games view.</p>
              )}
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
