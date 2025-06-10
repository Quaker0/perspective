import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import * as dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import request from 'supertest';
import { app } from '../src/index';
import User from '../src/models/User';

dotenv.config();

const insertedId = new ObjectId();
const userInput1 = {
    _id: new ObjectId(),
    name: 'Mock User 1',
    email: 'mock1@example.com',
    created: new Date('2025-01-01').toISOString(),
};
const userInput2 = {
    _id: new ObjectId(),
    name: 'Mock User 2',
    email: 'mock2@example.com',
    created: new Date('2025-05-31').toISOString(),
};

// const mockGetUserDocuments = jest.fn(() => Promise.resolve([user1, user2]));

jest.mock('../src/database/UserDatabaseClient', () => {
    return jest.fn().mockImplementation(() => {
        return {
            connect: jest.fn(),
            close: jest.fn(),
            createUser: jest.fn(() =>
                Promise.resolve({
                    acknowledged: true,
                    insertedId,
                }),
            ),
            getUserDocuments: jest.fn(() => Promise.resolve([userInput1, userInput2])),
        };
    });
});

describe('User API', () => {
    const userInput = {
        name: 'Test User',
        email: 'test@example.com',
    };

    beforeEach(() => {
        // mockCreateUser.mockClear();
        // mockGetUserDocuments.mockClear();
    });

    test('POST /users - shouPold create a user with valid input', async () => {
        const response = await request(app)
            .post('/users')
            .send(userInput)
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
        expect(response.body.status).toEqual('Success');
        // expect(mockCreateUser).toHaveBeenCalled();
    });

    test('POST /users - should fail with extra parameters', async () => {
        const response = await request(app)
            .post('/users')
            .send({ ...userInput, injection: 'bad' })
            .set('Accept', 'application/json');
        expect(response.status).toBe(400);
        expect(response.body.status).toEqual('Failed');
        // expect(mockCreateUser).not.toHaveBeenCalled();
    });

    test('POST /users - should fail with invalid email', async () => {
        const response = await request(app)
            .post('/users')
            .send({ ...userInput, email: 'not-an-email' })
            .set('Accept', 'application/json');
        expect(response.status).toBe(400);
        expect(response.body.status).toEqual('Failed');
    });

    test('GET /users - should return users', async () => {
        const response = await request(app).get('/users').set('Accept', 'application/json');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toEqual(true);
        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toEqual({ ...userInput1, _id: userInput1._id.toString() });
        expect(response.body[1]).toEqual({ ...userInput2, _id: userInput2._id.toString() });
    });
});
