import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/app';
import { insertedId, userInput1, userInput2 } from './testData/userData';
import User from '../src/models/User';

export const mockCreateUser = jest.fn((user: User) =>
    Promise.resolve({
        acknowledged: true,
        insertedId,
    }),
);
export const mockGetUserDocuments = jest.fn((created: string) =>
    Promise.resolve(created === 'asc' ? [userInput1, userInput2] : [userInput2, userInput1]),
);

jest.mock('../src/database/UserDatabaseClient', () => {
    return jest.fn().mockImplementation(() => {
        return {
            connect: jest.fn(),
            close: jest.fn(),
            createUser: (user: User) => mockCreateUser(user),
            getUserDocuments: (created: string) => mockGetUserDocuments(created),
        };
    });
});

describe('Users endpoints', () => {
    const newUserInput = {
        name: 'Test User',
        email: 'test@example.com',
    };

    beforeEach(() => {
        mockCreateUser.mockClear();
        mockGetUserDocuments.mockClear();
    });

    test('POST /users - should create a user with valid input', async () => {
        const response = await request(app)
            .post('/users')
            .send(newUserInput)
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
        expect(response.body.status).toEqual('Success');
        expect(mockCreateUser).toHaveBeenCalled();
        mockCreateUser.mock.calls.forEach((call) => {
            const user = call[0].toDisplay();
            expect(user.name).toEqual(newUserInput.name);
            expect(user.email).toEqual(newUserInput.email);
            expect(user._id).toBeDefined();
            expect(user.created).toBeDefined();
        });
    });

    test('POST /users - should fail with extra parameters', async () => {
        const response = await request(app)
            .post('/users')
            .send({ ...newUserInput, injection: 'bad' })
            .set('Accept', 'application/json');
        expect(response.status).toBe(400);
        expect(response.body.status).toEqual('Failed');
        expect(response.body.error).toEqual("Unrecognized key(s) in object: 'injection'");
        expect(mockCreateUser).not.toHaveBeenCalled();
    });

    test('POST /users - should fail with invalid email', async () => {
        const response = await request(app)
            .post('/users')
            .send({ ...newUserInput, email: 'not-an-email' })
            .set('Accept', 'application/json');
        expect(response.status).toBe(400);
        expect(response.body.status).toEqual('Failed');
        expect(mockGetUserDocuments).not.toHaveBeenCalled();
    });

    test('GET /users - should return users ascending', async () => {
        const response = await request(app)
            .get('/users?created=asc')
            .set('Accept', 'application/json');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toEqual(true);
        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toEqual({ ...userInput1, _id: userInput1._id.toString() });
        expect(response.body[1]).toEqual({ ...userInput2, _id: userInput2._id.toString() });
        expect(mockGetUserDocuments).toHaveBeenCalled();
    });

    test('GET /users - should return users descending', async () => {
        const response = await request(app)
            .get('/users?created=desc')
            .set('Accept', 'application/json');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toEqual(true);
        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toEqual({ ...userInput2, _id: userInput2._id.toString() });
        expect(response.body[1]).toEqual({ ...userInput1, _id: userInput1._id.toString() });
        expect(mockGetUserDocuments).toHaveBeenCalled();
    });

    test('GET /users - should fail with invalid created query value', async () => {
        const response = await request(app)
            .get('/users?created=invalid')
            .set('Accept', 'application/json');
        expect(response.status).toBe(400);
        expect(response.body.status).toEqual('Failed');
        expect(response.body.error).toEqual('Invalid sorting order');
        expect(mockGetUserDocuments).not.toHaveBeenCalled();
    });

    test('GET /users - should fail with extra query parameters', async () => {
        const response = await request(app)
            .get('/users?created=asc&foo=bar')
            .set('Accept', 'application/json');
        expect(response.status).toBe(400);
        expect(response.body.status).toEqual('Failed');
        expect(response.body.error).toMatch(/Unrecognized key\(s\) in object: 'foo'/);
        expect(mockGetUserDocuments).not.toHaveBeenCalled();
    });
});
