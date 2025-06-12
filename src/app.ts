import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import errorHandler from './middlewares/errorHandler';
import { requestContext } from './middlewares/requestContext';
import { validate } from './middlewares/validator';
import { createUserRoute, getUsersRoute } from './routes/userRoutes';
import { createUserSchema, getUsersSchema } from './schemas/userSchemas';

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
