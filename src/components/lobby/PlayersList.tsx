type PlayersListProps = {
  users: string[];
};

const PlayersList = ({ users }: PlayersListProps) => (
  <ul className="lobby-users">
    {users.map((user) => (
      <li key={user} className="lobby-user">
        <span className="lobby-user-dot" />
        <span>{user}</span>
      </li>
    ))}
  </ul>
);

export default PlayersList;
