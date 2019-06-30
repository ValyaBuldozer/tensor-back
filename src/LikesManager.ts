import DbConnection from "db";
import * as uuid from 'uuid/v4';

export default class LikesManager {

    private dbConnection: DbConnection;

    constructor(dbConnection: DbConnection) {
        this.dbConnection = dbConnection;
    }

    like(messageId, userId) {
        return this.dbConnection.saveLike(userId,messageId)
    }

    ifExists(messageId: number, userId: number): Promise<boolean> {
        return this.dbConnection.ifLikeExists(messageId, userId);
    }

    dislike(messageId: number, useriD: number): Promise<any> {
        return this.dbConnection.dislike(messageId, useriD);
    }
}