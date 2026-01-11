import fs from 'node:fs/promises'
import { readCodeFromFile, writeCodeToFile } from '../../utils/file.js';
import { sendToFrontend } from '../../utils/userMapper.js';
const sendFileCode = async(userId: string, data: any) => {
    const code = await readCodeFromFile({
        fileName: data.fileName,
        userId})
    sendToFrontend({
        userId,
        data: { type: 'FILE_CODE', payload: { fileName: data.fileName,code } }
    });
}

export { sendFileCode };