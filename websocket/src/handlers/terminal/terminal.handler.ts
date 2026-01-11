import { WSContext } from "../../context/wsContext.js";
import { writeToTerminal } from "./terminal.service.js";

export function terminalInputHandler(ctx: WSContext, msg: any) {
  
  writeToTerminal(ctx.userId!, msg.payload.data);
}
