import { WSContext } from "../context/wsContext.js";
import { handlers } from "../handlers/index.js";

export function routeMessage(ctx: WSContext, raw: string) {
  const message = JSON.parse(raw);

  if (!message?.type) {
    return ctx.send({ type: "ERROR", message: "Invalid message" });
  }

  console.log(ctx.userId,'context user');
  
  const handler = handlers[message.type as keyof typeof handlers];
  console.log(handler,'handler');
  
  if (!handler) {
    return ctx.send({ type: "ERROR", message: "Unknown type" });
  }

  handler(ctx, message);
}
