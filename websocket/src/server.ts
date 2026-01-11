import WebSocket, { WebSocketServer } from "ws";
import { routeMessage } from "./router/messageRouter.js";
import { createContext } from "./context/wsContext.js";
import wsAuthMiddleware from "./utils/auth.js";
import { addUser } from "./utils/userMapper.js";
import './utils/watcher.js';

export function createWSServer() {
  const wss = new WebSocketServer({ port: 8080 });

  wss.on("connection", async (ws, req) => {
    await wsAuthMiddleware(ws as unknown as globalThis.WebSocket, req)

    const ctx = createContext(ws, req);
    addUser({
      userId: ctx.userId!,
      ws: ws as any,
    })
    ws.on("message", (data) => {
      routeMessage(ctx, data.toString());
    });

    ws.on("close", () => ctx.cleanup());
  });
}
