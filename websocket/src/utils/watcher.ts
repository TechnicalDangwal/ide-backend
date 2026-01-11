
import chokidar from "chokidar";
import path from "path";
import { sendToFrontend } from "./userMapper.js";
import { getfileAndDirectory } from "./file.js";

const projectDir = path.join(process.cwd(), "src","code");

const watcher = chokidar.watch(projectDir, {
  persistent: true,
  ignoreInitial: true,
  usePolling: true,
  interval: 100
});

watcher
  .on("add", async(filePath) => {
    console.log(`📄 File added: ${filePath}`);
    const filesPath = filePath.split('/')
    console.log('files',filesPath[filesPath.length -2].split('-')[2]);

    const userId = filesPath.find((value: string) => value.startsWith('user-project-'))?.split('-')[2];
    console.log(userId,'userId');
    
    sendToFrontend({
        userId: userId!,
        data: {
            type: 'FILE_ADDED',
            payload: {
                data: {
                    files: await getfileAndDirectory(userId!)
                }
            }
        }
    })
  })
  .on("addDir", async(dirPath) => {
    console.log(`📁 Directory added: ${dirPath}`);
        const filesPath = dirPath.split('/')
    console.log('files',filesPath[filesPath.length -2].split('-')[2]);

    const userId = filesPath.find((value: string) => value.startsWith('user-project-'))?.split('-')[2];
    console.log(userId,'userId');
    
    sendToFrontend({
        userId: userId!,
        data: {
            type: 'FILE_ADDED',
            payload: {
                data: {
                    files: await getfileAndDirectory(userId!)
                }
            }
        }
    })
  })
  .on("error", (error) => console.error(`Watcher error: ${error}`));

console.log(`Watching ${projectDir} for new files and directories...`);