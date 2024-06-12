import { createOpenAI } from '@ai-sdk/openai'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY as string, //'sk-proj-EzIeKq9MGXAN1rNY8WpWT3BlbkFJRrHO4U2ymEvkfayCMio9',
  organization: process.env.OPENAI_ORG_ID as string, //'org-O96BNtpiUHMitxXVNh6QBOKd',
})

export default openai