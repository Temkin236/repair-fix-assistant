
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { IFixitService } from "./ifixitService";

const iFixitTools: FunctionDeclaration[] = [
  {
    name: "search_device",
    description: "Phase 1: Search iFixit for an official device key from a user query.",
    parameters: {
      type: Type.OBJECT,
      properties: { query: { type: Type.STRING } },
      required: ["query"]
    }
  },
  {
    name: "list_guides",
    description: "Phase 2: List available repair guides for a specific device title.",
    parameters: {
      type: Type.OBJECT,
      properties: { deviceTitle: { type: Type.STRING } },
      required: ["deviceTitle"]
    }
  },
  {
    name: "get_repair_steps",
    description: "Phase 3: Retrieve full step-by-step instructions and images for a specific guide ID.",
    parameters: {
      type: Type.OBJECT,
      properties: { guideId: { type: Type.STRING } },
      required: ["guideId"]
    }
  }
];

export class RepairAgent {
  private ai: GoogleGenAI;
  private ifixit: IFixitService;
  private model = "gemini-3-pro-preview";

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.ifixit = new IFixitService();
  }

  async processRequest(message: string, history: any[] = [], onStatus: (s: string) => void) {
    try {
      onStatus("Thinking...");
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: `You are FixMaster Agent. 
          1. Use 'search_device' to find the device.
          2. Use 'list_guides' to see repair options.
          3. Use 'get_repair_steps' for instructions.
          Always prioritize these tools. If no results found, clearly state that iFixit does not have documentation before suggesting alternatives.
          Safety: Always warn about high-voltage or gas risks first.`,
          tools: [{ functionDeclarations: iFixitTools }]
        }
      });

      let currentResponse = response;
      let toolCount = 0;

      // Tool Execution Loop
      while (currentResponse.functionCalls?.length && toolCount < 3) {
        toolCount++;
        const results = [];

        for (const call of currentResponse.functionCalls) {
          onStatus(`Executing ${call.name.replace('_', ' ')}...`);
          let result;
          if (call.name === "search_device") {
            result = await this.ifixit.searchDevice(call.args.query as string);
          } else if (call.name === "list_guides") {
            result = await this.ifixit.listTopics(call.args.deviceTitle as string);
          } else if (call.name === "get_repair_steps") {
            result = await this.ifixit.getGuideDetails(call.args.guideId as string);
          }
          
          results.push({
            id: call.id,
            name: call.name,
            response: { result: JSON.stringify(result) }
          });
        }

        currentResponse = await this.ai.models.generateContent({
          model: this.model,
          contents: [
            ...history,
            { role: 'user', parts: [{ text: message }] },
            { role: 'model', parts: [{ functionCalls: currentResponse.functionCalls }] },
            { role: 'user', parts: [{ functionResponses: results as any }] }
          ],
          config: { tools: [{ functionDeclarations: iFixitTools }] }
        });
      }

      // Check for search fallback if iFixit failed
      if (currentResponse.text?.toLowerCase().includes("not found") || !currentResponse.text) {
        onStatus("Verified documentation not found. Searching community web...");
        const searchRes = await this.ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [...history, { role: 'user', parts: [{ text: `${message} (Search for community repair solutions)` }] }],
          config: { tools: [{ googleSearch: {} }] }
        });
        
        return {
          text: searchRes.text,
          source: "Web Search Grounding",
          tool: "google_search",
          tokens: 2200
        };
      }

      return {
        text: currentResponse.text,
        source: "iFixit Official",
        tool: "ifixit_workflow",
        tokens: 1200 + (toolCount * 300)
      };
    } catch (e) {
      console.error(e);
      return { text: "Repair protocol interrupted. Please try again.", tokens: 0 };
    }
  }
}
