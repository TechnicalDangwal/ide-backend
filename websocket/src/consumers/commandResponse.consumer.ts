import { sendToFrontend } from "../utils/userMapper.js"

export default async(response: any) => {
    const {userId, chunk} = response;
    sendToFrontend({
        userId,
        data: {
            type: 'TERMINAL_OUTPUT',
            payload: {data: chunk}
        }
    })
}