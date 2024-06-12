import type { MetaFunction } from "@remix-run/node";
import styles from "./route.module.css";
import { useState } from "react";
import Chat from "../../components/Chat";
import { generateText } from 'ai'
import openai from '../../lib/openai.server';
import { orama } from '../../lib/orama.server';
import { ActionFunctionArgs } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: "Ave Mairie..IA" },
  ];
};

export default function Index() {
  const [messages, setMessages] = useState([]);

  const addMessage = (message: string) => {
    setMessages([...messages, message])
  }

  return (
    <div className={ styles.wrapper }>
      <h1 className={ styles.title }>Ave Ma<small>i</small>rie..IA</h1>
      <Chat messages={ messages } addMessage={ addMessage }/>
    </div>
  );
}

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const message = formData.get('message') as string;

  const documents = await orama.search({
      term: message,
      limit: 1,
      mode: 'hybrid'
  })

  if (documents?.hits.length > 0) {
    const response = await generateText({
      model: openai(process.env.OPENAI_MODEL),
      prompt: `Answer the following question: ${message} based on the following text: ${documents.hits[0].document.content}`
    })

    return { successful: true, message: response.text }
  }


  return { successful: false, message: 'L\'information que vous recherchez n\'a pas été trouvée. Vous pouvez contacter la mairie par telephone au +33 (0)2 40 21 60 37 ou par email à l\'adresse mairie@prefailles.fr.' }
}
