import UserDatabaseClient from '../database/UserDatabaseClient';
import User, { UserDisplayData } from '../models/User';
import { CreateUserBody } from '../schemas/userSchemas';

const databaseClient = new UserDatabaseClient();

export async function createUser(userInput: CreateUserBody): Promise<void> {
    const user = User.create(userInput);
    await databaseClient.createUser(user);
}

export async function getUsers(created: 'asc' | 'desc'): Promise<UserDisplayData[]> {
    const userDataArray = await databaseClient.getUserDocuments(created);
    return userDataArray.map((userData) => User.fromObject(userData).toDisplay());
}

export async function connectUserDatabase(): Promise<void> {
    await databaseClient.connect();
}

export async function closeUserDatabaseConnection(): Promise<void> {
    await databaseClient.close();
}
