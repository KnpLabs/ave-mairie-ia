import type { MetaFunction } from "@remix-run/node";
import styles from "./route.module.css";
import { useState } from "react";
import Chat from "../../components/Chat";
import { generateText } from 'ai'
import openai, { prompts } from '../../lib/openai.server';
import { orama } from '../../lib/orama.server';
import { ActionFunctionArgs } from '@remix-run/node';
import { Message } from "../../components/Chat/type";

export const meta: MetaFunction = () => {
  return [
    { title: "Ave Mairie..IA" },
  ];
};

export default function Index() {
  const [messages, setMessages] = useState([]);

  const addMessage = (message: Message) => {
    setMessages(messages => [...messages, message])
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
  const messages = formData.get('messages') as string;
  const message = formData.get('message') as string;
  const profile = formData.get('profile') as string;

  const documents = await orama.search({
      term: message,
      limit: 5,
      mode: 'hybrid'
  })

  if (documents?.hits.length > 0) {
    const response = await generateText({
      model: openai(process.env.OPENAI_MODEL),
      system: `
        ${prompts[profile]}

        Voici l'historique de conversation (tes réponses commencent par "system: " et celles de ton interlocuteur par "user: "):
        ${ messages }
        Fin de l'historique.

        Tu as accès aux informations suivante :

        ${documents.hits.map((hit) => hit.document.content).join("\n\n")}.`,
      prompt: message
    })

    return { successful: true, message: response.text }
  }


  return { successful: false, message: 'L\'information que vous recherchez n\'a pas été trouvée. Vous pouvez contacter la mairie par telephone au +33 (0)2 40 21 60 37 ou par email à l\'adresse mairie@prefailles.fr.' }
}
