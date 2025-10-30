import { z } from "zod/v4"

const faqInputSchema = z.object({
  question: z.string(),
})

export default faqInputSchema