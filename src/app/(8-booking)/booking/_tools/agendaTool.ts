import { tool } from "@langchain/core/tools";
import agendaInputSchema from "../_schemas/agendaInputSchema";
import mockAgenda from "../_datas/mockAgenda";

function findBestAppointment(input: { availableFrom?: string; availableTo?: string; availableDay?: string; }) {

    let availableSlots = mockAgenda.filter(slot => slot.patient === null)

    if (input.availableDay != null) {
        availableSlots = availableSlots.filter(slot =>
            slot.start.startsWith(input.availableDay as string)
        )
    }

    if (input.availableFrom && input.availableTo) { // !!! should use an llm to convert time to the right format ?
        const from = new Date(`${input.availableDay}T${input.availableFrom}Z`).getTime()
        const to = new Date(`${input.availableDay}T${input.availableTo}Z`).getTime()
        availableSlots = availableSlots.filter(slot => {
            const start = new Date(slot.start).getTime()
            return start >= from && start <= to
        })
    }

    if (availableSlots.length === 0) {
        return "No matching appointment available for the provided time period."
    }

    const bestSlot = availableSlots[0]
    console.log(bestSlot)
    // !!! should update agenda
    return `Best available appointment: ${bestSlot.start} to ${bestSlot.end} (UTC)`
}

const agendaTool = tool(
    async ({ availableFrom, availableTo, availableDay }) => {
        console.log("Searching appointment for:", availableFrom, availableTo, availableDay)
        return findBestAppointment({ availableFrom, availableTo, availableDay })
    },
    {
        name: "agendaMatcher",
        schema: agendaInputSchema,
        description:
        "Find the best available medical appointment within a professional's agenda based on the patient's availability window or specific day.",
    }
)

export default agendaTool