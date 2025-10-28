import { tool } from "@langchain/core/tools";
import agendaInputSchema from "../_schemas/agendaInputSchema";

const agendaTool = tool(
    async ({customerAvailability}) => {

        return "no result"
    },
    {
        name: "orderRetrieve",
        schema: agendaInputSchema,
        description: "Retrieve an order using the id of the order or the name of the customer.", 
    }
)

export default agendaTool