import DbConnection from "db";
import * as uuid from 'uuid/v4';

export default class UserManager {

    private dbConnection: DbConnection;
    private userTokens= new Map<string, string>();

    constructor(dbConnection: DbConnection) {
        this.dbConnection = dbConnection;
    }

    loginUser(username: string): string {
        const token = uuid();
        this.userTokens.set(token, username);
        return token;
    }

    getUsername(token: string): string {
        return this.userTokens.get(token);
    }

    isTokenExists(token: string): boolean {
        return this.userTokens.has(token);
    }
}