import { MongoClient, ServerApiVersion } from 'mongodb';
import User from '../models/User';

export default class UserDatabaseClient {
    private readonly client: MongoClient;

    constructor() {
        const dbUser = process.env.DB_USER;
        const dbPassword = process.env.DB_PASSWORD;
        if (!dbUser || !dbPassword) {
            throw new Error('Database credentials are not set in environment variables.');
        }
        const DB_URI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.qtk9aix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
        this.client = new MongoClient(DB_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
    }

    async connect() {
        await this.client.connect();
    }

    async createUser(user: User) {
        return await this.client
            .db('Sample')
            .collection('Users')
            .insertOne(user.toDatabaseObject());
    }

    async getUserDocuments(createdSortDirection: 'asc' | 'desc') {
        const userCollection = this.client.db('Sample').collection('Users');
        return await userCollection
            .find()
            .sort({ created: createdSortDirection === 'asc' ? 1 : -1 })
            .toArray();
    }

    async close() {
        if (this.client) {
            await this.client.close();
        }
    }
}
