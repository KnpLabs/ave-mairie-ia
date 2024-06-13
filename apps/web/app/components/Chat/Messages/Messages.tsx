import { useEffect, useRef } from 'react';
import { Message } from '../type';
import styles from './Messages.module.css'

export default function Messages({ messages }: { messages: Message[]}) {
  const $messages = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if ($messages.current) {
      $messages.current.scrollTop = $messages.current.scrollHeight
    }
  })

  return (
    <ul className={ styles.messages } ref={ $messages }>
      { messages.map(({ id, text, sender }) =>
          <li key={ id } className={ `${styles.message} ${styles[sender]}` }>{ text }</li>
      )}
    </ul>
  );
}