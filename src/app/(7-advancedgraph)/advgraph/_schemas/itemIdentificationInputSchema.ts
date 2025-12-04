import { z } from "zod/v4"

const orderRetrieveInputSchema = z.object({
  itemDescription: z.string().describe("Natural language description of an item"),
})

export default orderRetrieveInputSchema