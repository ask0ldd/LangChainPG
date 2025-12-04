import { z } from "zod/v4"

const SentimentInputSchema = z.object({
    message: z.string().describe('Natural language message related to a product'), 
})

export default SentimentInputSchema