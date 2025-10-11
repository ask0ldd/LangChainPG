import { z } from "zod/v4"

const orderRetrieveInputSchema = z.object({
  itemDescription: z.string(),
})

export default orderRetrieveInputSchema