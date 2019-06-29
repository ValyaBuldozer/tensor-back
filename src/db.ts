import { Application } from "express";
import * as mysql from 'mysql';

function db(app: Application): mysql.Connection {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'tensor',
        password: 'tensor',
        database: 'tensor'
    });

    connection.connect();

    return connection;
}

export default class DbConnection {

    private connection = mysql.createConnection({
        host: 'localhost',
        user: 'tensor',
        password: 'tensor',
        database: 'tensor'
    });

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
};
