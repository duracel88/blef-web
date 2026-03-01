import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { getLoggedUsers } from "../api/lobbyApi";
import type { LobbyEvent } from "../types/lobby";

export const useLobbySocket = (me: string | null) => {
  const [joinedUsers, setJoinedUsers] = useState<
    { name: string; status: "active" | "leaving" }[]
  >([]);

  useEffect(() => {
    if (me === null) {
      setJoinedUsers([]);
      return;
    }

    setJoinedUsers([{ name: me, status: "active" }]);

    const controller = new AbortController();

    const loadUsers = async () => {
      try {
        const result = await getLoggedUsers(controller.signal);

        if (!result.ok || result.data === null || !Array.isArray(result.data.users)) {
          return;
        }

        const cleaned = result.data.users
          .filter((username) => typeof username === "string" && username.trim() !== "")
          .map((username) => username.trim());

        setJoinedUsers(() => {
          const unique = Array.from(new Set(cleaned));
          if (me && !unique.includes(me)) {
            unique.unshift(me);
          }
          return unique.map((name) => ({ name, status: "active" }));
        });
      } catch {
        return;
      }
    };

    void loadUsers();

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const brokerURL = import.meta.env.DEV
      ? `ws://${window.location.hostname}:8080/api/ws`
      : `${protocol}://${window.location.host}/api/ws`;

    const client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      debug: (msg) => console.log(msg)
    });

    client.onConnect = () => {
      console.log("STOMP connected");
      client.subscribe("/topic/lobby", (message) => {
        console.log("Lobby message:", message.body);
        try {
          const payload = JSON.parse(message.body) as LobbyEvent;

          if (typeof payload.username !== "string" || payload.username.trim() === "") {
            return;
          }

          if (payload.type && payload.type !== "USER_LOGGED_IN" && payload.type !== "USER_LOGGED_OUT") {
            return;
          }

          if (payload.type === "USER_LOGGED_OUT") {
            setJoinedUsers((current) =>
              current.map((user) =>
                user.name === payload.username ? { ...user, status: "leaving" } : user
              )
            );

            window.setTimeout(() => {
              setJoinedUsers((current) =>
                current.filter((user) => user.name !== payload.username)
              );
            }, 420);
            return;
          }

          setJoinedUsers((current) =>
            current.some((user) => user.name === payload.username)
              ? current.map((user) =>
                  user.name === payload.username ? { ...user, status: "active" } : user
                )
              : [...current, { name: payload.username, status: "active" }]
          );
        } catch {
          return;
        }
      });
    };

    client.onStompError = (frame) => {
      console.error("Broker error:", frame.headers["message"], frame.body);
    };

    client.activate();

    return () => {
      controller.abort();
      void client.deactivate();
    };
  }, [me]);

  return { joinedUsers };
};
