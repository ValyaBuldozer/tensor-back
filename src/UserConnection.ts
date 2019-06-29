import { connection, IMessage } from "websocket";

export default class UserConnection {
    
    public token: string;
    public username: string;

    private socket: connection;

    constructor(token: string, username: string, socket: connection) {
        this.token = token;
        this.username = username;
        this.socket = socket;
        socket.on('message', this.onSocketMessage);
        socket.on('close', this.onSocketClose)
    }

    public onMessage: (type: string, token: string) => any;
    public onClose: () => any;

    public sendMessage(type: string, content: string) {
        this.socket.send(JSON.stringify({
            type,
            content
        }))
    }

    private onSocketMessage = (message: IMessage) => {
        if (message.type === 'utf8') {
            const { type, content } = JSON.parse(message.utf8Data);

            this.onMessage && this.onMessage(type, content);
        }
    }

    private onSocketClose = () => {
        this.onClose && this.onClose();
    }
}