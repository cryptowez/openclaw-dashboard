import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const openRouter = new OpenAIApi(configuration);