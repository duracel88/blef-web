import logo from "../assets/logo.svg";
import PlayersList from "../components/lobby/PlayersList";

type LobbyViewProps = {
  me: string;
  joinedUsers: string[];
  onLogout: () => void;
};

const LobbyView = ({ me, joinedUsers, onLogout }: LobbyViewProps) => (
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
        <h2 className="title lobby-title">Games</h2>
        <p className="subtitle">Waiting for game list.</p>
      </section>

      <aside className="lobby-pane lobby-sidebar">
        <h3 className="lobby-side-title">Players</h3>
        <PlayersList users={joinedUsers} />
      </aside>
    </div>
  </section>
);

export default LobbyView;
