import WebSocket from "ws";
import { getContainerIdByUserId, removeUser } from "../utils/userMapper.js";
import { rabbitmq } from "shared";

export interface WSContext {
  ws: WebSocket;
  userId?: string;
  containerId?: string;
  send: (msg: any) => void;
  cleanup: () => void;
}

export function createContext(ws: WebSocket, req: any): WSContext {
  return {
    ws,
    userId: req.userId,
    send: (msg) => ws.send(JSON.stringify(msg)),
    cleanup: () => {
      const containerId = getContainerIdByUserId(req.userId)
      if (containerId) {
        console.log('container destroy', containerId);

        rabbitmq.publishFanout('CONTAINER_DESTROY', {
          containerId
        })

        removeUser(req.userId)
      }
    }
  };
}
