import { io, type Socket } from "socket.io-client";

const socketUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, "") ??
    "";

let socket: Socket | null = null;
let connectedToken: string | null = null;

export function getSocket() {
    return socket;
}

export function connectSocket(token: string): Socket {
    if (socket && connectedToken === token) return socket;

    socket?.disconnect();
    socket = io(socketUrl, {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
    });
    connectedToken = token;
    return socket;
}

export function disconnectSocket() {
    socket?.disconnect();
    socket = null;
    connectedToken = null;
}
