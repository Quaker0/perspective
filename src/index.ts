import 'dotenv/config'; // Make sure to load environment variables before any imports

import { app } from './app';
import { closeUserDatabaseConnection, connectUserDatabase } from './controllers/userController';

const port = process.env.PORT || 3111;

function gracefulShutdown() {
    console.log('Shutting down server...');
    closeUserDatabaseConnection().then(() => {
        console.log('User database connection closed.');
        process.exit(0);
    });
}
process.on('SIGINT', gracefulShutdown).on('SIGTERM', gracefulShutdown);

async function startServer() {
    await connectUserDatabase();
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

startServer();
