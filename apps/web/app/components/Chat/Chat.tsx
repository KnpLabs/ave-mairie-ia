import { useState } from 'react';
import styles from './Chat.module.css'
import Prompt from './Prompt';
import Messages from './Messages';
import { Message } from './type';

const Chat = ({ messages, addMessage }: { messages: Message[], addMessage: (message: Message) => void }) =>
    <div className={ styles.wrapper }>
        <Prompt addMessage={ addMessage }/>
        <Messages messages={ messages }/>
    </div>

export default Chat