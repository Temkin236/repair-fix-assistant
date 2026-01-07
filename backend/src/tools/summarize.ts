import { gemini } from './index.js';

export async function summarize(messages) {
  const prompt = `Summarize the following chat history for context retention:\n${messages.map(m => m.content).join('\n')}`;
  const result = await gemini.generateContent(prompt);
  return result.text();
}
