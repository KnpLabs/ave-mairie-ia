import { Message } from '../type';
import styles from './Messages.module.css'

export default function Messages({ messages }: { messages: Message[]}) {
    return (
      <ul className={ styles.wrapper }>
        { messages.map(message =>
            <li key={ message }>{ message }</li>
        )}
      </ul>
    );
}