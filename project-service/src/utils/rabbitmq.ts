import { asyncHandler, rabbitmq } from "shared";
import consumerMap from "../consumers/consumer.map.js";

const startRabbitMQ = async (rabbitMQUrl: string) => {
    await rabbitmq.connectRabbitMQ(rabbitMQUrl, consumerMap)
    for(const [queueName, handler] of Object.entries(consumerMap)){
        await rabbitmq.consume(queueName, handler);
    }
}

export default startRabbitMQ;