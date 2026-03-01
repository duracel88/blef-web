import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import type { LobbyEvent } from "../types/lobby";

export const useLobbySocket = (me: string | null) => {
  const [joinedUsers, setJoinedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (me === null) {
      setJoinedUsers([]);
      return;
    }

    setJoinedUsers([me]);

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

          if (payload.type && payload.type !== "USER_LOGGED_IN") {
            return;
          }

          setJoinedUsers((current) =>
            current.includes(payload.username) ? current : [...current, payload.username]
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
      void client.deactivate();
    };
  }, [me]);

  return { joinedUsers };
};
