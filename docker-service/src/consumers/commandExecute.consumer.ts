import { rabbitmq } from "shared"
import { getUserShell } from "../manager/docker.manager"
import { Duplex } from "node:stream"

const userShell: Record<string, Duplex> = {}

export default async (data: { userId: string, containerId: string, cmd: string }) => {
    const { userId, containerId, cmd } = data
    let stream: Duplex | undefined = undefined
    try {
        const controller = new AbortController()
        const { signal } = controller
        if (!userShell[userId]) {
            stream = await getUserShell(containerId, signal), // just containerId
                userShell[userId] = stream
                
                let clearTimeOut = setTimeout(() => {
                    stream?.write('echo something went wrong\n')
                }, 5000);

            stream.on('data', (chunk: any) => {
                clearTimeout(clearTimeOut);
                let output = chunk.toString()
                output = output.replace(/[\u0000-\u001F\u007F]+/g, '');
                console.log(output)
                rabbitmq.publishFanout('COMMAND_RESPONSE', { userId, chunk: output })
            })

            stream.on('error', (err) => {
                console.error('Shell error', err)
                delete userShell[userId]
            })

            stream.on('close', () => {
                console.log('Shell closed for user:', userId)
                delete userShell[userId]
            })
        } else {
            stream = userShell[userId]
        }

        // 3️⃣ Write command with newline
        stream.write(cmd + ' && echo [DONE]\n')

    } catch (error) {
        if (stream) {
            stream.write('echo "Error initializing shell"\n' + ' && echo [DONE]\n')
        }
    }
}
