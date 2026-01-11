import express from 'express';
import { config } from 'dotenv';
import dbConnection from './utils/dbConnection.js';
import router from './routes/project.routes.js';
import { globalErrorHandler, rabbitmq } from 'shared';
import startRabbitMQ from './utils/rabbitmq.js';

const app = express();
const PORT = process.env.PORT || 3005;
config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/project', router);

app.use(globalErrorHandler);

(async () => {
    await startRabbitMQ(process.env.RABBITMQ_URL as string)
    await dbConnection();
    app.listen(PORT, () => {
        console.log(`Auth service is running on port ${PORT}`);
    })
})()

export default app;