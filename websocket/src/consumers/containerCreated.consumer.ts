import { getfileAndDirectory } from "../utils/file.js";
import { addUser, getContainerIdByUserId, sendToFrontend } from "../utils/userMapper.js"

export default async ({containerId,userId}: {containerId: string , userId: string}) => {
    addUser({userId,containerId})    
    console.log('reached',getContainerIdByUserId(userId));

    sendToFrontend({
        userId,
        data: {
            type: 'SESSION_STARTED',
            payload: {
                data: {
                    files: await getfileAndDirectory(userId)
                }
            }
        } 
    })
}