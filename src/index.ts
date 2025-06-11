import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import { createUserRoute, getUsersRoute } from './routes/userRoutes';
import { closeUserDatabaseConnection, connectUserDatabase } from './controllers/userController';
import { validate } from './middlewares/validator';
import { createUserSchema, getUsersSchema } from './schemas/userSchemas';
import errorHandler from './middlewares/errorHandler';
import { requestContext } from './middlewares/requestContext';

dotenv.config();

export const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(requestContext);
app.options('*', cors());

app.post('/users', validate(createUserSchema), errorWrapper(createUserRoute));
app.get('/users', validate(getUsersSchema), errorWrapper(getUsersRoute));

function errorWrapper(fn: Function) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}

app.use(errorHandler);

function gracefulShutdown() {
    console.log('Shutting down server...');
    closeUserDatabaseConnection().then(() => {
        console.log('User database connection closed.');
        process.exit(0);
    });
}
process.on('SIGINT', gracefulShutdown).on('SIGTERM', gracefulShutdown);

const port = process.env.PORT || 3111;

async function startServer() {
    await connectUserDatabase();
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

startServer();
