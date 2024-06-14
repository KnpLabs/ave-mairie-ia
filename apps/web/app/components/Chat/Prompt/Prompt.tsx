import { useEffect, useRef } from 'react';
import styles from './Prompt.module.css'
import { useFetcher } from '@remix-run/react';
import { Message, Sender } from '../type';
import { v4 as uuidv4 } from 'uuid';
import Send from '~/components/Icons/Send';

const Prompt = ({ addMessage, messages }: { addMessage: (message: Message) => void, messages: Message[] }) => {
  const $form = useRef<HTMLFormElement>(null)
  const $audio = useRef<HTMLFormElement>(null)
  const fetcher = useFetcher({ key: 'chat' })

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      addMessage({
        id: uuidv4(),
        sender: Sender.User,
        text: fetcher.formData.get('message') as string,
      })

      $form.current.querySelector('input[name="message"]').value = ''

      return;
    }

    if (fetcher.state === 'idle' && fetcher.data?.message !== undefined) {
      addMessage({
        id: uuidv4(),
        text: fetcher.data.message as string,
        sender: Sender.System,
      })

      return;
    }
  }, [fetcher.state, fetcher.data])

  useEffect(() => {
    if ($audio.current) {
      if (fetcher.state === 'submitting') {
        $audio.current.volume = 1;
        $audio.current.play()

        return
      }

      const interval = 200;

      const fadeout = setInterval(
        function() {
          if ($audio.current.volume > 0) {
            $audio.current.volume = Math.max(0, $audio.current.volume - 0.2);
          } else {
            // Stop the setInterval when 0 is reached
            clearInterval(fadeout);
            $audio.current.pause()
            $audio.current.currentTime = 0;
          }
        }, interval);
    }
  }, [fetcher.state])

  return (
    <>
      <fetcher.Form className={ styles.wrapper } method="post" ref={ $form }>
        <div className={ styles.profile }>
          <select name="profile">
            <option value="default">Default</option>
            <option value="goeland">Goeland</option>
            <option value="johnny">Johnny</option>
            <option value="beauf">Beauf</option>
          </select>
        </div>
        <div className={ styles.bar }>
          <input name="message" type="text" placeholder="Type a message" />
          <button type="submit">
            <span>Invoque</span>
            <Send width={ 16 } height={ 16 } />
          </button>
        </div>
        <div className={ styles.hidden }>
          <textarea name="messages" defaultValue={ messages.map(({ id, text, sender }) => `${sender}: ${text}\n`) } />
        </div>
      </fetcher.Form>
      <audio ref={ $audio } volume={ 0 } src="/holy.mp3" />
    </>
  );
}

export default Prompt