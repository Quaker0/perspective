import { ObjectId } from 'mongodb';

export const insertedId = new ObjectId();

export const userInput1 = {
    _id: new ObjectId(),
    name: 'Mock User 1',
    email: 'mock1@example.com',
    created: new Date('2025-01-01').toISOString(),
} as const;

export const userInput2 = {
    _id: new ObjectId(),
    name: 'Mock User 2',
    email: 'mock2@example.com',
    created: new Date('2025-05-31').toISOString(),
} as const;
