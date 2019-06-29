import { server as webSocketServer, connection } from 'websocket';
import UserManager from './UserManager';
import UserConnection from './UserConnection';
import Chat from './Chat';

function websockets(server, userManager: UserManager, chat: Chat) {
    const ws = new webSocketServer({
        httpServer: server
    });

    ws.on('request', request => {
        const tokenCookie = request.cookies.find(({name}) => name === 'token');

        if (tokenCookie && userManager.isTokenExists(tokenCookie.value)) {
            const { value: token } = tokenCookie,
                username = userManager.getUsername(token),
                connection = request.accept(null, request.origin),
                userConnection = new UserConnection(token, username, connection);

            chat.addUser(userConnection);
        } else {
            request.reject(403, 'Unauthorized');
        }
    })
}

export default websockets;
