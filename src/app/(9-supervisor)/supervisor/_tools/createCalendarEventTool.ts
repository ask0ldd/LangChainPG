import { tool } from "@langchain/core/tools";
import createCalendarEventSchema from "../_schemas/createCalendarEventSchema";

const createCalendarEventTool = tool(
  async ({ title, startTime, endTime, attendees, location }) => {
    // Stub: In practice, this would call Google Calendar API, Outlook API, etc.
    return `Event created: ${title} from ${startTime} to ${endTime} with ${attendees.length} attendees`
  },
  {
    name: "create_calendar_event",
    description: "Create a calendar event. Requires exact ISO datetime format.",
    schema: createCalendarEventSchema,
  }
)

export default createCalendarEventTool