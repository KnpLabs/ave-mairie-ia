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
            <Prompt addMessage={ addMessage }/>
            <div className={ `${styles.messages} ${ messages.length > 0 ? styles.active : '' } ${ isLoading ? styles.loading : '' }` }>
                <Messages messages={ messages } />
            </div>
        </div>
    )
}

export default Chat