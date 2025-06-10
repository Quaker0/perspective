import { ObjectId } from 'mongodb';

export default class User {
    private _id: ObjectId;
    private created: Date;
    private name: string;
    private email: string;

    private constructor() {}

    static create(name: string, email: string): User {
        const user = new User();
        user._id = new ObjectId();
        user.created = new Date();
        user.name = name;
        user.email = email;
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

    toDatabaseObject() {
        return {
            _id: this._id,
            name: this.name,
            email: this.email,
            created: this.created,
        };
    }

    toOutput() {
        return {
            _id: this._id.toString(),
            name: this.name,
            email: this.email,
            created: this.created,
        };
    }
}
