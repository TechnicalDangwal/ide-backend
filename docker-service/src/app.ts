import { rabbitmq } from "shared";
import consumerMap from "./consumers/consumer.map.js";

export const startRabbitMQ = async () => {

    await rabbitmq.connectRabbitMQ(process.env.RABBITMQ_URL!,consumerMap);

};
