import UserDatabaseClient from '../database/UserDatabaseClient';
import User from '../models/User';
import { CreateUserInput } from '../validators/userValidators';

const databaseClient = new UserDatabaseClient();

export async function createUser(userInput: CreateUserInput): Promise<void> {
    const user = User.fromObject(userInput);
    await databaseClient.createUser(user);
}

export async function getUsers(created: 'asc' | 'desc'): Promise<any[]> {
    // TODO: fix typing
    const userDataArray = await databaseClient.getUserDocuments(created);
    return userDataArray.map((userData) => User.fromObject(userData).toOutput());
}

export async function connectUserDatabase(): Promise<void> {
    await databaseClient.connect();
}

export async function closeUserDatabaseConnection(): Promise<void> {
    await databaseClient.close();
}
