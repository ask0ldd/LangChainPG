import { tool } from "@langchain/core/tools";
import orderRetrieveInputSchema from "../_schemas/orderRetrieveInputSchema";

const orderRetrieveTool = tool(
    async ({customerName, orderId}) => {
        if(orderId) {
            console.log('orderId :', orderId)
            return ({id : orderId, product : '3 black shirts', customer : 'ced', date : Date.now})
        }

        if(customerName?.toLowerCase().includes("ced")) {
            console.log('customerName :', customerName)
            return ({id : 123456, product : '2 cargo shorts', customer : 'ced', date : Date.now, status : 'Payment has been rejected due to insufficient funds on the cutsomer account.'})
        }

        return "no result"
    },
    {
        name: "orderRetrieve",
        schema: orderRetrieveInputSchema,
        description: "Retrieve an order using its orderId or the last order for a specific customerName.", 
    }
)

export default orderRetrieveTool