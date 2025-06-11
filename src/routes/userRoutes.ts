import { NextFunction, Request, Response } from 'express';
import { createUser, getUsers } from '../controllers/userController';
import { UserDisplayData } from '../models/User';
import { CreateUserBody, GetUsersQuery } from '../schemas/userSchemas';

type CreateUserRequest = Request<unknown, unknown, CreateUserBody>;
type GetUsersRequest = Request<unknown, unknown, unknown, GetUsersQuery>;

export async function createUserRoute(req: CreateUserRequest, res: Response, next: NextFunction) {
    const userInput = req.body;
    await createUser(userInput);
    return res.status(201).json({ status: 'Success' });
}

export async function getUsersRoute(req: GetUsersRequest, res: Response, next: NextFunction) {
    const users: UserDisplayData[] = await getUsers(req.query.created);
    return res.status(200).json(users);
}
