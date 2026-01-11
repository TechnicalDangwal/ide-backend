import { rabbitmq } from "shared";
import { getContainerIdByUserId } from "../../utils/userMapper.js";

export function writeToTerminal(userId: string, data: string) {

  let containerId = getContainerIdByUserId(userId)
  
  rabbitmq.publishFanout('COMMAND_EXECUTE',{
    userId,
    containerId,
    cmd:data
  })
  
}
