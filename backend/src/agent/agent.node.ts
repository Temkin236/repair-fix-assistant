// Agent Node: Gemini LLM, uses agentPrompt.txt
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const agentPrompt = fs.readFileSync('./server/agentPrompt.txt', 'utf-8');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const gemini = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

export async function agentNode(state) {
  // state contains messages, tool results, etc.
  // Compose prompt with agentPrompt and current state
  const prompt = `${agentPrompt}\n\nConversation:\n${state.messages.map(m => m.content).join('\n')}`;
  const result = await gemini.generateContent(prompt);
  // Parse tool call requests from result (if any)
  // Return next action: respond or call tool
  return result;
}
