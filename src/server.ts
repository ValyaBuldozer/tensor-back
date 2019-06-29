import * as express from 'express';
import routes from './routes';
import websockets from './websockets';
import DbConnection from './db';
import * as bodyParser from 'body-parser';
import UserManager from './UserManager';
import Chat from './Chat';

const app = express();

app.use(bodyParser.json());
app.use(express.static('static'));
app.use('/', express.static(__dirname + 'statis'))

const dbConnection = new DbConnection(),
    chat = new Chat(),
    userManager = new UserManager(dbConnection),
    route = routes(app, dbConnection, userManager);

const httpServer = app.listen(5000);

websockets(httpServer, userManager, chat);
