import { z } from "zod/v4"

const SentimentInputSchema = z.object({
    message: z.string(), 
})

export default SentimentInputSchema