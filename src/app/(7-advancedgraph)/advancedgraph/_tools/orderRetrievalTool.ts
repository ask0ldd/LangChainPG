import { tool } from "@langchain/core/tools";
import orderRetrievalInputSchema from "../_schemas/OrderRetrievalInputSchema";
import orders from "../_datas/orders";

const orderRetrievalTool = tool(
    async ({customerName, orderId}) => {
        if(orderId) {
            // console.log(orderId)
            return JSON.stringify((orders.find(order => order.order_id == orderId)))
        }

        if(customerName) {
            // console.log(customerName)
            return JSON.stringify((orders.find(order => order.customer_name.toLowerCase().trim().includes(customerName.toLowerCase().trim()))))
        }

        return "no result"
    },
    {
        name: "orderRetrieve",
        schema: orderRetrievalInputSchema,
        description: "Retrieve an order using the id of the order or the name of the customer.", 
    }
)

export default orderRetrievalTool