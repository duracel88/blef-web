type LobbyUser = {
  name: string;
  status: "active" | "leaving";
};

type PlayersListProps = {
  users: LobbyUser[];
};

const PlayersList = ({ users }: PlayersListProps) => (
  <ul className="lobby-users">
    {users.map((user) => (
      <li key={user.name} className={`lobby-user ${user.status === "leaving" ? "is-leaving" : ""}`.trim()}>
        <span className="lobby-user-dot" />
        <span>{user.name}</span>
      </li>
    ))}
  </ul>
);

export default PlayersList;
