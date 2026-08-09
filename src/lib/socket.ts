import { io } from "socket.io-client";

export const socket = io(
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000",
  {
    autoConnect: false,
  },
);
