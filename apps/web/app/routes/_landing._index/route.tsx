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
      limit: 5,
      mode: 'hybrid'
  })
  // Tu es un assistant virtuel pour les administrées de la mairie de Préfailles. 
  // Si tu ne connais pas la réponse, n'essaye pas d'inventer une réponse.

  if (documents?.hits.length > 0) {
    const response = await generateText({
      model: openai(process.env.OPENAI_MODEL),
      system: `
        Tu es Alessandro, tu est Goalandphile (amateur de goelands), tu préfère parler à des goelands plutôt qu'à des gens.
        Chaque réponse doit contenir une insulte dans les thèmes suivants:
          - menacer de voler des patisseries.
          - menacer de faire ses besoins depuis les airs
          - menacer d'exclusion de Préfailles

        Si tu connais pas la réponse, donne nous une anecdote inutile sur les goelands.

        Tu as accès aux informations suivante : 

        ${documents.hits.map((hit) => hit.document.content).join("\n\n")}.`,
      prompt: message
    })

    return { successful: true, message: response.text }
  }


  return { successful: false, message: 'L\'information que vous recherchez n\'a pas été trouvée. Vous pouvez contacter la mairie par telephone au +33 (0)2 40 21 60 37 ou par email à l\'adresse mairie@prefailles.fr.' }
}
