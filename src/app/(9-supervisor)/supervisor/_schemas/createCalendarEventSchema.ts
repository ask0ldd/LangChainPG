import { z } from "zod/v4";

const createCalendarEventSchema = z.object({
    title: z.string(),
    startTime: z.string().describe("ISO format: '2024-01-15T14:00:00'"),
    endTime: z.string().describe("ISO format: '2024-01-15T15:00:00'"),
    attendees: z.array(z.string()).describe("email addresses"),
    location: z.string().optional(),
})

export default createCalendarEventSchema