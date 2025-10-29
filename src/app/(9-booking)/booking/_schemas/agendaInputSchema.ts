import { z } from "zod/v4"

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

const agendaInputSchema = z.object({
  availableFrom: z.string().regex(timeRegex, "Time must be in HH:MM:SS format")/*.datetime()*/.optional(),
  availableTo: z.string().regex(timeRegex, "Time must be in HH:MM:SS format")/*.datetime()*/.optional(),
  availableDay: z.string().optional(),
})

export default agendaInputSchema