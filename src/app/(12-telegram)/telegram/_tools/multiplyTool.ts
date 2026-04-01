import { tool } from "@langchain/core/tools";
import multiplyInputSchema from "../_schemas/multiplyInputSchema";

const multiply = async ({ a, b } : {a : number, b : number}) => a * b

export const multiplyTool = tool(
    multiply,
    {
        name: "multiply",
        schema: multiplyInputSchema,
        description: "Multiplies numbers a and b. The arguments a and b must strictly be of type number.",
    }
)