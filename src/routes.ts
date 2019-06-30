import { Application } from "express";
import * as mysql from 'mysql';
import DbConnection from "db";
import UserManager from "UserManager";

function routes(app: Application, dbConnection: DbConnection, userManager: UserManager) {

    app.get('/hello', (req, res) => {
        res.send('hi');
    })

    app.post('/login', (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            res.sendStatus(400);
        }

        dbConnection.loginUser(username, password)
            .then(result => {
                if (result && username && password) {
                    const token = userManager.loginUser(username);
                    res.cookie('token', token);
                    res.sendStatus(200);
                } else {
                    res.sendStatus(403);
                }
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500);
            });
    });

    app.put('/register', (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            res.sendStatus(400);
        }

        dbConnection.registerUser(username, password)
            .then(result => {
                if (result) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(403);
                } 
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500);
            })
    })
}      

export default routes;
