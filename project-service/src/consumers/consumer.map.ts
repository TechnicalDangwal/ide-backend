import userRegisteredConsumer from "./userRegistered.consumer.js";

const consumerMap: [{ queueName: string, handler: (data: any) => Promise<void>, type: "pubsub" | "queue" }] = [
  {
    queueName: 'user.registered',
    handler: userRegisteredConsumer,
    type: "pubsub"
  }
]

export default consumerMap;