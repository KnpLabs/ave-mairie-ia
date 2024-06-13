import { useEffect, useRef } from 'react';
import styles from './Prompt.module.css'
import { useFetcher } from '@remix-run/react';
import { Message, Sender } from '../type';
import { v4 as uuidv4 } from 'uuid';

const Prompt = ({ addMessage }: { addMessage: (message: Message) => void }) => {
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

      $form.current?.reset()

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
    <fetcher.Form className={ styles.wrapper } method="post" ref={ $form }>
      <audio ref={ $audio } volume={ 0 } src="/holy.mp3"></audio>
      <input name="message" type="text" placeholder="Type a message" />
      <button type="submit">Invoque</button>
    </fetcher.Form>
  );
}

export default Prompt