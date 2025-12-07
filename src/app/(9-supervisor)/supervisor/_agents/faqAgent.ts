import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import faqTool from "../_tools/faqTool";
import { tool } from "@langchain/core/tools";
import { z } from "zod/v4";

/*const CALENDAR_AGENT_PROMPT = `
You are a calendar scheduling assistant.
Parse natural language scheduling requests (e.g., 'next Tuesday at 2pm')
into proper ISO datetime formats.
Use get_available_time_slots to check availability when needed.
Use create_calendar_event to schedule events.
Always confirm what was scheduled in your final response.
`.trim();*/

const FAQ_TOPICS = `
- brand identity, 
- product details, 
- materials, 
- sizing guidance, 
- ordering process, 
- payment methods, 
- shipping and delivery policies, 
- returns and exchanges, 
- community engagement, 
- influencer and ambassador programs, 
- customization options, 
- wholesale inquiries, 
- customer support services.
`.trim()

const FAQ_AGENT_PROMPT = `
You are a helpful and knowledgeable customer support assistant for Revolt Clothing.
Your role is to answer customer questions and provide accurate, friendly, and detailed information related to the brand.
You can address inquiries on the following topics: 
${FAQ_TOPICS}
`.trim()

const model = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.3,
    maxTokens: 300,
    maxRetries: 2,
})

const faqAgent = createReactAgent({
  llm: model,
  tools: [faqTool],
  prompt: FAQ_AGENT_PROMPT,
})

export const faqAgentAsTool = tool(
  async ({ request }) => {
    const result = await faqAgent.invoke({
      messages: [{ role: "user", content: request }]
    });
    const lastMessage = result.messages[result.messages.length - 1];
    return lastMessage.text;
  },
  {
    name: "faq_assistant",
    description: `
Reply a question from a customer using natural language.

Use this when the user wants to get some informations about the following topics :
${FAQ_TOPICS}

Input: Natural language informations request (e.g., 'tell me more about Revolt Clothing return policy')
    `.trim(),
    schema: z.object({
      request: z.string().describe("Natural language informations request"),
    }),
  }
)