import UserConnection from "./UserConnection";

export default class Chat {

    private userConnections: UserConnection[] = []

    constructor() {

    }

    addUser(userConneciton: UserConnection) {
        userConneciton.onMessage = this.onMessage(userConneciton.username);

        this.userConnections.push(userConneciton);
    }

    private onMessage = (username: string) => (type: string, content: string) => {
        switch(type) {
            case ('message'): {
                this.userConnections.forEach(
                    user => user.sendMessage('message', `${username}: ${content}`)
                );
            }

            
        }
    }

    
}