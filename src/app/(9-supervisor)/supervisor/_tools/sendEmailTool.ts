import { tool } from "@langchain/core/tools";
import sendEmailSchema from "../_schemas/sendEmailSchema";

const sendEmailTool = tool(
  async ({ to, subject, body, cc }) => {
    // !!! Stub: In practice, this would call SendGrid, Gmail API, etc.
    return `Email sent to ${to.join(', ')} - Subject: ${subject}`;
  },
  {
    name: "send_email",
    description: "Send an email via email API. Requires properly formatted addresses.",
    schema: sendEmailSchema,
  }
)

export default sendEmailTool