import UserConnection from "./UserConnection";
import DbConnection from "./db";
import LikesManager from "./LikesManager";
import Limiter from "./limiter";

export default class Chat {

    private userConnections: UserConnection[] = []
    private likesManager: LikesManager;
    private db: DbConnection;
    private limiter: Limiter;

    constructor(db: DbConnection) {
        this.db = db;
        this.likesManager = new LikesManager(db);
    }

    addUser(userConneciton: UserConnection) {
        userConneciton.onMessage = this.onMessage(userConneciton);

        this.userConnections.push(userConneciton);
    }

    private onMessage = (userConneciton: UserConnection) => (data : any) => {
        const { username } = userConneciton;

        if (!this.limiter) {this.limiter = new Limiter(() => username, {
            denyTime: 1 * 30 * 1000,
            limit: 15,
            saveTime: 1 * 60 * 1000
        })}

        const {type} = data;
        //const userConneciton = this.userConnections.find((uc) => uc.username === username);
        switch (type) {

            case ('message'): {
                if (this.limiter.checkRequest(null)) {
                    const {content, id} = data;
                    const time = new Date().toLocaleDateString();
                    this.userConnections.forEach(
                        user => user.sendMessage('message', content, username, time, id)
                    );
    
                    this.db.saveMessage(username, content);
                }
                else {
                   // userConneciton.sendMessage
                }
               
                break;
            }
            case ('like'): {
                const {messageId} = data;
                this.db.getUser(userConneciton.username).then((userId) => {

                    this.likesManager.ifExists(messageId, userId)
                        .then(ifExist => {
                            if (ifExist) {
                                this.likesManager.dislike(messageId, userId).then(like => {
                                    this.userConnections.forEach(
                                        user => user.sendLike('dislike', messageId)
                                    );
                                }).catch((reason) => {
                                    console.log(reason)
                                    console.log('dup like')
                                });
                            } else {
                                this.likesManager.like(messageId, userId).then(like => {
                                    this.userConnections.forEach(
                                        user => user.sendLike('like', messageId)
                                    );
                                }).catch((reason) => {
                                    console.log(reason)
                                    console.log('dup like')
                                });
                            }
                        });
                });
                break;
            }
            case ('getMessages'): {
                this.db.getMessages(username).then((messages) => {
                    console.log(messages.length)
                    console.log('')
                    userConneciton.sendMessages('messages-list', messages)
                })
                break;
            }


        }
    }


}