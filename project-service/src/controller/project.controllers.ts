import { Request, Response } from "express";
import path from "node:path";
import {  ApiResponse, asyncHandler, rabbitmq } from "shared";
import {cp, deleteDirectory, existDirectory, getFileNameByPath} from '../utils/file.js'

const create = asyncHandler(async (req: Request, res: Response) => {
    const projectLanguage: string = req.params.projectLanguage
    const userId = req.headers['x-user-id']
    console.log(userId,'headers');
    
    console.log(projectLanguage);
    rabbitmq.publishFanout('CONTAINER_CREATE',{
        projectLanguage,
        userId

    })
    console.log(process.cwd());
    //  path.dirname

    const dirPath = path.join(process.cwd(),'src','code',`user-project-${userId}`)
    const pathExists = await existDirectory(dirPath)
    console.log(pathExists);
    
    if(pathExists){
        await deleteDirectory(dirPath)
        console.log('exists');
        
    }
    await cp(path.join(process.cwd(),'src','code',projectLanguage), dirPath)
    res.status(200).json(new ApiResponse(200,'project open',{
    }))
})

export { create };