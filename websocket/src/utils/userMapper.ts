import { WSContext } from "../context/wsContext.js"

const userMap: Record<string, any> = {}

const addUser = (data: {userId: string, containerId?: string, ws?: WebSocket}): void => {
  const { userId, containerId, ws } = data;

  if (userMap[userId]) {
    if (containerId) userMap[userId].containerId = containerId;
    if (ws) userMap[userId].ws = ws;
  } else {
    userMap[userId] = { ws, containerId };
  }
};

const getContainerIdByUserId = (userId: string): string | null => {
    if(!userMap[userId]){
        return null
    }
    Object.keys(userMap).forEach((id)=>{
        console.log(id, 'id');
        
    })
    return userMap[userId].containerId
}

const sendToFrontend = ({userId,data}:{userId: string, data: Record<string, any>}) => {
    console.log('i am here', data);
    
    userMap[userId].ws.send(JSON.stringify(data))
}
const removeUser = (userId: string): void => {
  delete userMap[userId];
};

export { addUser, getContainerIdByUserId, sendToFrontend, removeUser}