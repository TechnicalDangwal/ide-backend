import fs from 'node:fs/promises';
import path from 'node:path';

type FileNode = {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
};

const getfileAndDirectory = async (userId: string) => {
  const rootDir = path.join(process.cwd(), 'src', 'code', `user-project-${userId}`);

  async function readDirectory(dir: string): Promise<FileNode[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    const result: FileNode[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        result.push({
          name: entry.name,
          type: 'directory',
          children: await readDirectory(fullPath),
        });
      }

      if (entry.isFile()) {
        result.push({
          name: entry.name,
          type: 'file',
        });
      }
    }

    return result;
  }

  const tree = {
    name: 'root',
    type: 'directory',
    children: await readDirectory(rootDir),
  };

  return tree
};


const writeCodeToFile = async (params: {
  code: string;
  fileName: string;
  userId: string;}) => {
  try {
    const { code, fileName, userId } = params;
    await fs.writeFile(path.join(process.cwd(), 'src', 'code', `user-project-${userId}`, fileName), code, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write to file: ${error}`);
  }
};

const readCodeFromFile = async (params: {
  userId: string;
  fileName: string;
}): Promise<string> => {
  try {
    const { userId, fileName } = params;
    const filePath = path.join(process.cwd(), 'src', 'code', `user-project-${userId}`, fileName);
    const code = await fs.readFile(filePath, 'utf-8');
    return code;
  } catch (error) {
    throw new Error(`Failed to read file: ${error}`);
  }
};

export { getfileAndDirectory, writeCodeToFile, readCodeFromFile };
