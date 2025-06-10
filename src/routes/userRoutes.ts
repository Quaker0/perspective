import { Request, Response, NextFunction } from 'express';
import { CreateUserInput, GetUsersInput } from '../validators/userValidators';
import { plainToInstance } from 'class-transformer';
import { createUser, getUsers } from '../controllers/userController';
import User from '../models/User';

export async function createUserRoute(req: Request, res: Response, next: NextFunction) {
    const userInput = plainToInstance(CreateUserInput, req.body);
    await userInput.validate(); // Move to middleware??
    await createUser(userInput);
    return res.status(201).json({ status: 'Success' });
}

export async function getUsersRoute(req: Request, res: Response, next: NextFunction) {
    const query = plainToInstance(GetUsersInput, req.query);
    // await query.validate();
    // TODO: implement validation for query parameters
    const users: User[] = await getUsers(query.created);
    return res.status(200).json(users);
}
