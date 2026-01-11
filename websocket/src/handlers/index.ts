import { editorHandler } from "./editor/editor.handler.js";
import { fileHandler } from "./openFile/file.handler.js";
import { terminalInputHandler } from "./terminal/terminal.handler.js";
// import { runCodeHandler } from "./code/run.handler";
// import { pingHandler } from "./system/ping.handler";

export const handlers = {
  TERMINAL_INPUT: terminalInputHandler,
  CODE_EDITOR: editorHandler,
  OPEN_FILE: fileHandler
} as const;
