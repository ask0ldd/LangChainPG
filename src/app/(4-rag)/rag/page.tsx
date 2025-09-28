import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { stateOfTheUnionDoc } from "./_docs/stateoftheunion";
import { Document } from "langchain/document";
// https://js.langchain.com/docs/tutorials/rag/
// positionnement dans l'espace
// valeur semantique
// image vector space :  https://miro.medium.com/v2/resize:fit:1400/1*8sTPaluiGbuY0UVHLO563A.png
// similarity : https://assets.zilliz.com/Figure_1_Embeddings_in_2_D_vector_space_6522ce6d91.png

export default async function RAG() {

  const embeddingModel = new OllamaEmbeddings()
  const vectorStore = new MemoryVectorStore(embeddingModel);
  
  const model2 = new ChatGroq({
    model: "gemma2-9b-it",
    temperature: 0.7,
    maxTokens: 100,
    maxRetries: 2,
  })

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant using the given data to formulate a reply."],
    ["system", "Given data: {retrievedData}"],
    ["user", "{question}"]
  ]);

  // explain semantic chunking
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000, chunkOverlap: 200
  });

  const splits = await splitter.splitText(stateOfTheUnionDoc);

  const documents = splits.map(
    (text, idx) => new Document({ pageContent: text, metadata: { chunk: idx } })
  )

  await vectorStore.addDocuments(documents)

  // !!! reformuler phrase 3/4 fois
  const question = "Who got his lungs burnt by pit fumes ?";
  const retrievedDocs = await vectorStore.similaritySearch(question, 3);
  const retrievedData = retrievedDocs.map(doc => doc.pageContent).join("\n\n")

  const chain = promptTemplate.pipe(model2);
  const response = await chain.invoke({ question, retrievedData });

  console.log("response:", response.content || response.text || response);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <span>content</span>
        <div>
          LangGraph
        </div>
      </main>
    </div>
  );
}
