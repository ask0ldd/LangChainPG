import { tool } from "@langchain/core/tools";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import faq from "../_datas/faq";
import { OllamaEmbeddings } from "@langchain/ollama";
import faqSchema from "../_schemas/faqSchema";

// pas besoin de split, creer des docs QA pairs suffisants, besoin de la valeur semantique de la pair

const faqTool = tool(
    async ({question}) => {
        const embeddingModel = new OllamaEmbeddings()
        const itemsVectorStore = new MemoryVectorStore(embeddingModel);

        const documents: Document<{chunk: number;}>[] = []

        faq.forEach(section => {
            section.QAPairs.forEach(QAPair => {
                documents.push(
                    new Document({ 
                        pageContent: `${section.category}\nQuestion:${QAPair.question}\nAnswer:${QAPair.answer}`, 
                        metadata: { chunk: documents.length } 
                    })
                )
            })
        })
        
        await itemsVectorStore.addDocuments(documents)

        const retrievedItems = await itemsVectorStore.similaritySearch(question, 3);

        if(retrievedItems.length) {
            console.log(retrievedItems.reduce((accumulator, currentValue) => accumulator + currentValue.pageContent + '\n\n', ''))
            return retrievedItems.reduce((accumulator, currentValue) => accumulator + currentValue.pageContent + '\n\n', '')
        }

        return "no result"
    },
    {
        name: "faqDatabase",
        schema: faqSchema,
        description: "Retrieve general knowledge related to the following topics: Revolt Clothing’s brand identity, product details, materials, sizing guidance, ordering process, payment methods, shipping and delivery policies, returns and exchanges, community engagement, influencer and ambassador programs, customization options, wholesale inquiries, and customer support services.", 
    }
)

export default faqTool