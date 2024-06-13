export enum Sender {
    System = 'system',
    User = 'user',
}

export type Message = {
    id: string,
    text: string,
    sender: Sender,
}