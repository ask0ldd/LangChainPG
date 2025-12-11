import { ChatGroq } from "@langchain/groq";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { faqAgentAsTool } from "../_agents/faqAgent";
import SUPERVISOR_PROMPT from "../_prompts/supervisorPrompt";

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