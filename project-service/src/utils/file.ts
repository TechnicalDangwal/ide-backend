import fs from 'node:fs/promises'
const getFileNameByPath = async(path:string) => {
    const dir = await fs.readdir(path)
    console.log(dir);
    return dir
    
}

const cp = (src: string, destination: string) => {
    // fs.mkdir(destination)
    fs.cp(src,destination,{recursive: true})
}

const existDirectory = async (path:string) => {
    try {
        await fs.access(path)
        return true
    } catch {
        return false
    }
}

const deleteDirectory = async (path:string) => {
    try {
        await fs.rm(path,{recursive:true, force:true})
        return true
    } catch {
        return false
    }
}

export {getFileNameByPath, cp, existDirectory, deleteDirectory}