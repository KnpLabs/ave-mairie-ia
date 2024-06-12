import { FormEvent, useEffect, useRef } from 'react';
import styles from './Prompt.module.css'
import { useFetcher } from '@remix-run/react';

const Prompt = ({ addMessage }: { addMessage: (message: string) => void }) => {
  const $form = useRef<HTMLFormElement>(null)
  const fetcher = useFetcher({ key: 'chat' })

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      const message = fetcher.formData.get('message') as string

      addMessage(message)
      $form.current?.reset()

      return;
    }

    if (fetcher.state === 'idle' && fetcher.data?.message !== undefined) {
      addMessage(fetcher.data?.message)

      return;
    }
  }, [fetcher.state, fetcher.data])

  return (
    <fetcher.Form className={ styles.wrapper } method="post" ref={ $form }>
      <input name="message" type="text" placeholder="Type a message" />
      <button type="submit">Invoque</button>
    </fetcher.Form>
  );
}

export default Prompt