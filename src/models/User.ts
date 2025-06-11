import { ObjectId } from 'mongodb';
import { CreateUserBody } from '../schemas/userSchemas';

export interface UserDatabaseObject {
    _id: ObjectId;
    name: string;
    email: string;
    created: Date;
}

export interface UserDisplayData {
    _id: string;
    name: string;
    email: string;
    created: Date;
}

export default class User {
    private _id: ObjectId;
    private created: Date;
    private name: string;
    private email: string;

    private constructor() {}

    static create(input: CreateUserBody): User {
        const user = new User();
        user._id = new ObjectId();
        user.created = new Date();
        user.name = input.name;
        user.email = input.email;
        return user;
    }

    static fromObject(data: Record<string, any>): User {
        const user = new User();
        user._id = data._id;
        user.created = data.created;
        user.name = data.name;
        user.email = data.email;
        return user;
    }

    toDatabaseObject(): UserDatabaseObject {
        return {
            _id: this._id,
            name: this.name,
            email: this.email,
            created: this.created,
        };
    }

    toDisplay(): UserDisplayData {
        return {
            _id: this._id.toString(),
            name: this.name,
            email: this.email,
            created: this.created,
        };
    }
}
