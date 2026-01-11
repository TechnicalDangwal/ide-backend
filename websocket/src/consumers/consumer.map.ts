import commandResponseConsumer from "./commandResponse.consumer.js";
import containerCreatedConsumer from "./containerCreated.consumer.js";

const consumerMap: { queueName: string, handler: (data: any) => Promise<void>, type: "pubsub" | "queue" } [] = [
  {
    queueName: 'CONTAINER_CREATED',
    handler: containerCreatedConsumer,
    type: "pubsub"
  },
    {
    queueName: 'COMMAND_RESPONSE',
    handler: commandResponseConsumer,
    type: "pubsub"
  }
]

export default consumerMap;