// Tool Runner Node: executes agent-requested tools
import { searchIFixit, getIFixitGuide, webSearch, summarizeContext } from './tools.js';

export async function toolRunnerNode(state) {
  // state contains tool requests from agentNode
  const { toolRequest } = state;
  let result;
  switch (toolRequest.name) {
    case 'search_ifixit':
      result = await searchIFixit(toolRequest.args.query);
      break;
    case 'get_ifixit_guide':
      result = await getIFixitGuide(toolRequest.args.device, toolRequest.args.issue);
      break;
    case 'web_search':
      result = await webSearch(toolRequest.args.query);
      break;
    case 'summarize_context':
      result = await summarizeContext(toolRequest.args.messages);
      break;
    default:
      result = { error: 'Unknown tool' };
  }
  // Return tool result to agentNode
  return { ...state, toolResult: result };
}
