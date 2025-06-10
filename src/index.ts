import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import { createUserRoute, getUsersRoute } from './routes/userRoutes';
import { InputValidationError } from './validators/Validator';
import { closeUserDatabaseConnection, connectUserDatabase } from './controllers/userController';

dotenv.config();

export const app: Express = express();
app.use(cors());
app.use(express.json());
app.options('*', cors());

app.post('/users', errorWrapper(createUserRoute));
app.get('/users', errorWrapper(getUsersRoute));

function errorWrapper(fn: Function) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}

app.use(errorMiddleware);

function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof InputValidationError) {
        return res.status(400).json({ status: 'Failed', error: error.message });
    }
    console.error('Error occurred:', error);
    return res.status(500).json({ status: 'Failed', error: 'Internal Server Error' });
}

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
