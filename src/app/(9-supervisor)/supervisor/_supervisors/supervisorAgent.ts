import { ChatGroq } from "@langchain/groq";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import faqAgent, { faqAgentAsTool } from "../_agents/faqAgent";

const SUPERVISOR_PROMPT = `
You are a helpful personal assistant.
You can schedule calendar events and send emails.
Break down user requests into appropriate tool calls and coordinate the results.
When a request involves multiple actions, use multiple tools in sequence.
`.trim();

const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.3,
    maxTokens: 300,
    maxRetries: 2,
})

const supervisorAgent = createReactAgent({
  llm : model,
  tools: [faqAgentAsTool],
  prompt: SUPERVISOR_PROMPT,
  checkpointer: new MemorySaver(), 
});