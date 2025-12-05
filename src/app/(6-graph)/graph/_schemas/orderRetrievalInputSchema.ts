import { z } from "zod/v4"

const orderRetrievalInputSchema = z.object({
  orderId: z.string().optional().describe('Unique id associated to the order'),
  customerName: z.string().optional().describe('Name of the customer')
}).refine(
  data => data.orderId || data.customerName,
  {
    message: "Either orderId or customerName is required.",
    path: ["orderId", "customerName"],
  }
)

export default orderRetrievalInputSchema