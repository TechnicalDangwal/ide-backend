import { rabbitmq } from "shared";
import { createContainer } from "../manager/docker.manager";

export default async (data: {projectLanguage: string, userId: string}) => {
    const { projectLanguage, userId } = data;
    console.log(data , 'we reached');
    const container = await createContainer(projectLanguage, userId)
    rabbitmq.publishFanout('CONTAINER_CREATED',{
        containerId: container.id,
        userId
    })

}