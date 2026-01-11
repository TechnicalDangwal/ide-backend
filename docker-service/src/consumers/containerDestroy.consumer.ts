import { deleteContainer } from "../manager/docker.manager"

export default async(data: { containerId: string}) => {
    const { containerId } = data
    console.log(containerId,'for delete');
    if(containerId){
        deleteContainer(containerId)
    }
}