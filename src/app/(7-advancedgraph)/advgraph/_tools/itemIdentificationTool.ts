import { tool } from "@langchain/core/tools";
import itemIdentificationInputSchema from "../_schemas/itemIdentificationInputSchema";
import clothingItems from "../_datas/clothingItems";
import { OllamaEmbeddings } from "@langchain/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document"; // !!! import Document

const itemIdentificationTool = tool(
    async ({itemDescription}) => {

        const embeddingModel = new OllamaEmbeddings()
        const itemsVectorStore = new MemoryVectorStore(embeddingModel);
        
        const documents = clothingItems.map(
            (item) => new Document({ pageContent : item.full_description, metadata: { itemId : item.id } })
        )
        
        await itemsVectorStore.addDocuments(documents)
        
        const retrievedItems = await itemsVectorStore.similaritySearch(itemDescription, 3);
        const retrievedIds = retrievedItems.map(doc => doc.metadata.itemId)

        if (retrievedIds.length) {
            const foundItems = retrievedIds.map(id => clothingItems.find(item => item.id == id));
            // console.log(JSON.stringify(foundItems))
            return JSON.stringify(foundItems);
        }

        return "no item matching the description"
    },
    {
        name: "itemIdentification",
        schema: itemIdentificationInputSchema,
        description: "Retrieve an item based on a loose description.", 
    }
)

export default itemIdentificationTool