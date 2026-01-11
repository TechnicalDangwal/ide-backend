import fs from 'node:fs/promises'
import { writeCodeToFile } from '../../utils/file.js';
const writeToFile = (userId: string, data: any) => {
    // Logic to write data to a file associated with the userId
    console.log(`Writing data for user ${userId}: ${JSON.stringify(data)}`);


    writeCodeToFile({
        code: data.value,
        fileName: data.file,
        userId
    })
}

export { writeToFile };