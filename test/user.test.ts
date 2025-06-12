import { describe, expect, test } from '@jest/globals';
import User from '../src/models/User';
import { userInput1 } from './testData/userData';

describe('User model', () => {
    test('create() should create a User instance with correct fields', () => {
        const input = { name: userInput1.name, email: userInput1.email };
        const user = User.create(input);
        expect(user).toBeInstanceOf(User);
        expect(user).toHaveProperty('name', userInput1.name);
        expect(user).toHaveProperty('email', userInput1.email);
        expect(user).toHaveProperty('_id');
        expect(user).toHaveProperty('created');
    });

    test('fromObject() should create a User instance from a plain object', () => {
        const user = User.fromObject(userInput1);
        expect(user).toBeInstanceOf(User);
        expect(user).toHaveProperty('_id', userInput1._id);
        expect(user).toHaveProperty('name', userInput1.name);
        expect(user).toHaveProperty('email', userInput1.email);
        expect(user).toHaveProperty('created', userInput1.created);
    });

    test('toDatabaseObject() should return only the correct fields', () => {
        const user = User.fromObject({ ...userInput1, extra: 'param' });
        const dbObj = user.toDatabaseObject();
        expect(dbObj).toEqual({
            _id: userInput1._id,
            name: userInput1.name,
            email: userInput1.email,
            created: userInput1.created,
        });
    });
});
