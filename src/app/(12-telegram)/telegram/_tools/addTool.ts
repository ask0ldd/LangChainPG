import { tool } from "@langchain/core/tools"
import addInputSchema from "../_schemas/addInputSchema"

const add      = async ({ a, b } : {a : number, b : number}) => a + b

const addTool = tool(
    add, // la fonction a executerd afin d'obtenir un résultat
    {
        name: "add",
        schema: addInputSchema, // les variables que le model doit passer au tool
        description: "Adds a and b.", // décrit les traitements effectués par le tool pour que le model sache dans quel contexte l'utiliser
    }
)

export default addTool