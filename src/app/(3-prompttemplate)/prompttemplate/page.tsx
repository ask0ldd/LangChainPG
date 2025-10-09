import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
// https://js.langchain.com/docs/concepts/tool_calling/
// https://www.youtube.com/watch?v=pi3C6y4gWFA
// https://github.com/in-tech-gration/LangChain.js
// https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/?ajs_aid=4c487466-0b7f-4925-96a6-a76122227d21#making-your-first-agent-using-langgraph

// https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB/sections/CAQiQ0NCQVNMQW9JTDIwdk1EZGpNWFlTQW1WdUdnSlZVeUlOQ0FRYUNRb0hMMjB2TUcxcmVpb0pFZ2N2YlM4d2JXdDZLQUEqKggAKiYICiIgQ0JBU0Vnb0lMMjB2TURkak1YWVNBbVZ1R2dKVlV5Z0FQAVAB?hl=en-US&gl=US&ceid=US%3Aen

export default async function PromptTemplate() {
  
  const model2 = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.3,
    maxTokens: 100,
    maxRetries: 2,
  })

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant."],
    ["user", "Tell me a joke about {topic}"]
  ]);
  const Runnableschain = promptTemplate.pipe(model2);
  const resultMessage = await Runnableschain.invoke({ topic: "computer science" })
  console.log('response:', resultMessage.content || resultMessage.text || resultMessage);

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
