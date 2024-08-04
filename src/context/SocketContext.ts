import { Socket, io } from "socket.io-client";
import { getAccessToken } from "../utils/helpers.ts";
import React from "react";

const socket = io(
  `http://localhost:${import.meta.env.VITE_BACKEND_SOCKET_PORT}`,
  {
    auth: async (cb) => {
      cb({
        token: await getAccessToken(),
      });
    },
  }
);
const SocketContext = React.createContext<{ socket: Socket }>({ socket });
export { socket, SocketContext };
