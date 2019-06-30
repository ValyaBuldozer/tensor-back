import { Application } from "express";
import * as mysql from 'mysql';
import { resolve } from "url";

export default class DbConnection {

    private connection = mysql.createConnection({
        host: 'localhost',
        user: 'tensor',
        password: 'tensor',
        database: 'tensor'
    });

    getUser(username: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.connection.query(`select * 
            from users 
            where username = '${username}'`,
                (err, rows, fields) => {

                    if (err) {
                        throw err
                    }

                    if (rows[0]) {
                        resolve(rows[0].user_id)
                    } else {
                        resolve(-1)
                    }
                }
        )})
    }

    getMessages(username) {
        return new Promise<any>((resolve, reject) => {
            this.connection.query(
                `SELECT message_id, username, content
                    , (case when likes is null then 0 else likes end) as likes
                FROM messages
                LEFT JOIN (
                    SELECT messageId, count(userId) as likes
                    FROM likes
                    GROUP BY messageId
                ) as likes_count ON messages.message_id = likes_count.messageId
                order by message_id;
                `, (err, rows, fields) => {
                    if (err) {
                        throw err;
                    }
                    const promises = [];
                    
                    resolve(rows);
                })
        })

    }

    getLikes(messageId) {
        return new Promise<any>((resolve, reject) => {
            this.connection.query(`select * 
            from likes where messageId = ${messageId}`, (err, rows) => {
                    if (err) {
                        throw err;
                    }

                    resolve(rows)
                })
        })
    }

    loginUser(username: string, password: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.query(
                `select * 
                from users 
                where username = '${username}' and password = '${password}';`,
                (err, rows, fields) => {
                    if (err) {
                        throw err;
                    }

                    if (rows[0]) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            );
        });
    }

    registerUser(username: string, password: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.query(
                `insert into users(username, password)
                values ('${username}', '${password}')`,
                (err, rows, fields) => {
                    if (err) {
                        throw err;
                    }

                    resolve(true);
                }
            )
        });
    }

    saveMessage(username: string, content: string): Promise<boolean> {
        return new Promise<boolean>((resole, reject) => {
            this.connection.query(
                `insert into messages(username, content)
                values ('${username}', '${content}')`,
                (err, rows, fields) => {
                    if (err) {
                        throw err;
                    }

                    resole(true);
                }
            )
        })
    }

    saveLike(userId, messageId) {
        return new Promise<boolean>((resolve, reject) => {
            if (!userId || !messageId) {
                reject('invalid data')
            }
            this.connection.query(
                `insert into likes(messageId, userId)
                values ('${messageId}', '${userId}')`,
                (err, rows, fields) => {
                    if (err) {
                        throw err;
                    }

                    resolve(messageId);
                }
            )
        })
    }

    ifLikeExists(messageId: number, userId: number) {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.query(
                `select * from likes 
                where messageId = '${messageId}' and userId = '${userId}'`,
                (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    console.log(rows)
                    console.log(!!rows[0])
                    resolve(!!rows[0]);
                }
            )
        })
    }

    dislike(messageId: number, userId: number) {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.query(
                `delete from likes
                where messageId = '${messageId}' and userId = '${userId}'`,
                (err, rows) => {
                    if (err) {
                        throw err;
                    }

                    resolve(true);
                }
            )
        })
    }
};
