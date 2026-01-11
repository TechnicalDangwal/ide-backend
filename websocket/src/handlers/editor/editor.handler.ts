import { WSContext } from "../../context/wsContext.js";
import { writeToFile } from "./editor.service.js";
// import { writeToTerminal } from "./terminal.service.js";

export function editorHandler(ctx: WSContext, msg: any) {
  
  writeToFile(ctx.userId!, msg.payload.data);

}
