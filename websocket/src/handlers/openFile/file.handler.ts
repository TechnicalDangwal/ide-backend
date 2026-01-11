import { WSContext } from "../../context/wsContext.js";
import { sendFileCode } from "./file.service.js";

export function fileHandler(ctx: WSContext, msg: any) {
  
  sendFileCode(ctx.userId!, msg.payload);

}
