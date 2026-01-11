import Docker, { Container, Volume } from 'dockerode';
import { randomUUID } from 'node:crypto';
const docker = new Docker({ socketPath: '//./pipe/docker_engine' });
import path from 'node:path'
import Stream, { Duplex } from 'node:stream';
import mapper from '../mapper/mapper';
import { unlink } from 'node:fs/promises';
import { rabbitmq } from 'shared';

// async function runPythonInteractive() {
//     // Pull Python image if needed
//     await new Promise((resolve, reject) => {
//         docker.pull('python:3', (err: any, stream: any) => {
//             if (err) return reject(err);
//             stream.pipe(process.stdout)
//             docker.modem.followProgress(stream, (err: any) => err ? reject(err) : resolve(null));
//         });
//     });

//     const container = await createContainer('python')
//     deleteContainer(container.id)
//     console.log('Container finished');
// }

const createContainer = async (image: string, userId: string): Promise<Docker.Container> => {



    if (!(Object.keys(mapper).includes(image))) {
        throw Error('Image is Not found')
    }
    await new Promise((resolve, reject) => {
        docker.pull(image, (err: any, stream: any) => {
            if (err) return reject(err);
            stream.pipe(process.stdout)
            docker.modem.followProgress(stream, (err: any) => err ? reject(err) : resolve(null));
        });
    });
    const container = await docker.createContainer({
        Image: image,
        // Cmd: ['tail', '-f', '/dev/null'],     // interactive Python
        Tty: true,            // allocate pseudo-terminal
        name: randomUUID(),
        WorkingDir: '/app',
        HostConfig: {
            Binds: [`${path.join(process.cwd(), 'src', 'code', `user-project-${userId}`)}:/app`]
        },
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        OpenStdin: true
    });

    await container.start()

    return container
}

const getContainer = async (id: string): Promise<Docker.Container> => {
    return docker.getContainer(id)
}

const stopContainer = async (containerId: string): Promise<void> => {
    const container = await getContainer(containerId)
    await container.stop()

}

const deleteContainer = async (containerId: string): Promise<void> => {
    const container = await getContainer(containerId)
    console.log(await container.inspect());

    await container.stop()
    await container.remove()

}

const getUserShell = async (containerId: string, signal: AbortSignal): Promise<Duplex> => {
    const container = await getContainer(containerId)
    console.log(container,'con');
    
    const exec = await container.exec({
        Cmd: ["sh"],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        // Tty: true
    });

    const stream = await exec.start({ hijack: true, stdin: true });
    if(signal){
        signal.addEventListener('abort', () => stream.destroy())
    }
    return stream
}

export { createContainer, getContainer, stopContainer, deleteContainer, getUserShell }