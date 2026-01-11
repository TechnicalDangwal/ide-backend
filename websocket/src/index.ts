import { createWSServer } from "./server.js";
import startRabbitMQ from "./utils/rabbitmq.js";

startRabbitMQ(process.env.RABBITMQ_URL!)
createWSServer();
