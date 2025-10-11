import { z } from "zod/v4"

const faqSchema = z.object({
  question: z.string(),
})

export default faqSchema