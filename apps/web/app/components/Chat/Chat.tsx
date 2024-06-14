import { useEffect, useState } from 'react';
import styles from './Chat.module.css'
import Prompt from './Prompt';
import Messages from './Messages';
import { Message } from './type';
import { useFetcher } from '@remix-run/react';

const Chat = ({ messages, addMessage }: { messages: Message[], addMessage: (message: Message) => void }) => {
    const [isLoading, setIsLoading] = useState(true)
    const fetcher = useFetcher({ key: 'chat' })

    useEffect(() => {
        if (fetcher.state === 'submitting') {
            setIsLoading(true)
        }

        if (fetcher.state === 'idle') {
            setIsLoading(false)
        }
    }, [fetcher.state])

    return (
        <div className={ styles.wrapper }>
            <div className={ `${styles.messages} ${ messages.length > 0 ? styles.active : '' } ${ isLoading ? styles.loading : '' }` }>
                { messages.length > 0 ? <Messages messages={ messages } /> : null }
            </div>
            <Prompt addMessage={ addMessage } messages={ messages }/>
        </div>
    )
}

export default Chat