import { tool } from "@langchain/core/tools";
import z from "zod/v4";

export const manageEmail = tool(
  async ({ request }) => {
    const result = await emailAgent.invoke({
      messages: [{ role: "user", content: request }]
    });
    const lastMessage = result.messages[result.messages.length - 1];
    return lastMessage.text;
  },
  {
    name: "manage_email",
    description: `
Send emails using natural language.

Use this when the user wants to send notifications, reminders, or any email communication.
Handles recipient extraction, subject generation, and email composition.

Input: Natural language email request (e.g., 'send them a reminder about the meeting')
    `.trim(),
    schema: z.object({
      request: z.string().describe("Natural language email request"),
    }),
  }
);