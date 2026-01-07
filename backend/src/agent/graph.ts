// Minimal LangGraph loop for agentic autonomy
import { StateGraph } from '@langchain/langgraph';
import { agentNode } from './agentNode.js';
import { toolRunnerNode } from './toolRunnerNode.js';

const stateSchema = {/* define your state schema here */};

const graph = new StateGraph(stateSchema);
graph.addNode('agent', agentNode);
graph.addNode('tools', toolRunnerNode);
graph.addEdge('agent', 'tools');
graph.addEdge('tools', 'agent');
graph.setEntryPoint('agent');

export default graph;
