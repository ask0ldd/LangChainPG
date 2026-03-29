import { OllamaEmbeddings } from "@langchain/ollama";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import clothingItems from "../_datas/clothingItems";

const embeddingModel = new OllamaEmbeddings()
const itemsVectorStore = new MemoryVectorStore(embeddingModel);

const documents = clothingItems.map(
    (item) => new Document({ pageContent : item.full_description, metadata: { itemId : item.id } })
)

await itemsVectorStore.addDocuments(documents)

export default itemsVectorStore

