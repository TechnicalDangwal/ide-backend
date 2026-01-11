import express from 'express';
import { config } from 'dotenv';
import dbConnection from './utils/dbConnection.js';
import router from './routes/auth.routes.js';
import { globalErrorHandler, rabbitmq } from 'shared';
import cookieParser from 'cookie-parser'

const app = express();
const PORT = process.env.PORT || 3000;
config();

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/auth', router);

app.use(globalErrorHandler);

(async () => {
    await rabbitmq.connectRabbitMQ(process.env.RABBITMQ_URL as string)
    await dbConnection();
    app.listen(PORT, () => {
        console.log(`Auth service is running on port ${PORT}`);
    })
})()

export default app;