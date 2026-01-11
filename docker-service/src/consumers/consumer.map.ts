import commandExecuteConsumer from "./commandExecute.consumer";
import containerDestroyConsumer from "./containerDestroy.consumer";
import createDockerContainerConsumer from "./createDockerContainer.consumer";

const consumerMap: { queueName: string, handler: (data: any) => Promise<void>, type: "pubsub" | "queue" }[] = [
  {
    queueName: 'CONTAINER_CREATE',
    handler: createDockerContainerConsumer,
    type: "pubsub"
  },
  {
    queueName: 'COMMAND_EXECUTE',
    handler: commandExecuteConsumer,
    type: "pubsub"
  },
  {
    queueName: 'CONTAINER_DESTROY',
    handler: containerDestroyConsumer,
    type: "pubsub"
  },
]

export default consumerMap;