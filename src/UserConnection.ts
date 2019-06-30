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
        socket.on('close', this.onSocketClose);
    }

    public onMessage: (data: any) => any;
    public onClose: () => any;

    public sendMessage(type: string, content: string, username: string, time: string, id: number) {
        this.socket.send(JSON.stringify({
            type, message: {
                content,
                username,
                time,
                id
            }
        }));
    }

    public sendLike(type: string, messageId: any) {
        this.socket.send(JSON.stringify({
            type,
            messageId
        }))
    }

    public sendMessages(type: string, messages: Array<any>) {
        this.socket.send(JSON.stringify({ type, messages }))
    }

    private onSocketMessage = (message: IMessage) => {
        if (message.type === 'utf8') {
            const data = JSON.parse(message.utf8Data);
            console.log(`Request ${message.utf8Data}`)
            this.onMessage && this.onMessage(data);
        }

    }

    private onSocketClose = () => {
        this.onClose && this.onClose();
    }
}