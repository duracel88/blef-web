import { useState } from "react";
import logo from "../assets/logo.svg";
import PlayersList from "../components/lobby/PlayersList";

type LobbyViewProps = {
  me: string;
  joinedUsers: { name: string; status: "active" | "leaving" }[];
  onLogout: () => void;
};

const LobbyView = ({ me, joinedUsers, onLogout }: LobbyViewProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const tabs = [
    { id: "all", label: "All games" },
    { id: "pending", label: "Pending games" },
    { id: "awating", label: "Awating games" },
  ];

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
            <button className="button ghost lobby-add" type="button">+</button>
          </div>
          <div className="lobby-tab-panel">
            {activeTab === "all" ? (
              <p className="subtitle">All games view.</p>
            ) : activeTab === "pending" ? (
              <p className="subtitle">Pending games view.</p>
            ) : (
              <p className="subtitle">Awating games view.</p>
            )}
          </div>
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
