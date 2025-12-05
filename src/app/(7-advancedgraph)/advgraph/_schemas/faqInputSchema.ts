import { z } from "zod/v4"

const faqInputSchema = z.object({
  question: z.string().describe("Customer's question related to Revolt Clothing policies"),
})

export default faqInputSchema