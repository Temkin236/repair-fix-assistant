import { SqliteSaver } from '@langchain/langgraph-checkpoint-sqlite';

export const saver = new SqliteSaver('./server/langgraph.db');

export function getThreadId(userId, chatSessionId) {
  return `${userId}:${chatSessionId}`;
}
