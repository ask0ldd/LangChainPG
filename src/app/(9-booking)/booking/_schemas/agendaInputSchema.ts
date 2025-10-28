import { z } from "zod/v4"

const agendaInputSchema = z.object({
  customerAvailability: z.string(),
})

export default agendaInputSchema