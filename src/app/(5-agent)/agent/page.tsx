/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChatGroq } from "@langchain/groq";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import sentimentAnalyzerTool from "./_tools/sentimentAnalyzerTool";
// https://js.langchain.com/docs/concepts/tool_calling/
// https://www.youtube.com/watch?v=pi3C6y4gWFA
// https://github.com/in-tech-gration/LangChain.js
// https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/?ajs_aid=4c487466-0b7f-4925-96a6-a76122227d21#making-your-first-agent-using-langgraph

// un seul agent
// pass tools, model, checkpoint saver
// pass a prompt
export default async function Agent(){

  const agentModel = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.3,
    maxTokens: 300,
    maxRetries: 2,
  })

  // Initialize memory to persist state between graph runs
  const agentCheckpointSaver = new MemorySaver();
  // Creates a StateGraph agent that relies on a chat model utilizing tool calling.
  const agent = createReactAgent({
    llm: agentModel,
    tools: [sentimentAnalyzerTool],
    checkpointSaver: agentCheckpointSaver,
  })

  const sentimentPromptTemplate = ChatPromptTemplate.fromMessages([
    ["system", "You are a customer feedback analysis assistant. If needed, you can use a sentiment analyzing tool to analyze a product review."],
    ["human", `Rate the following review: "{review}".`]
  ]);

  const replyPromptTemplate = ChatPromptTemplate.fromMessages([
    ["human", "If the review is negative, respond with a brief apology. If it is positive, reply with a short thank-you message. All messages should be 3-liners and as specific as possible."]
  ]);

  const REVIEWS = {
    positive : "The product match the picture as it is beautiful and stylish.",
    negative : "The product is far too large. It doesn't seem the match an european XL size."
  }

  const agentSentimentState = await agent.invoke(
    { 
      messages: await sentimentPromptTemplate.formatMessages({review : REVIEWS.negative})
    },
    { configurable: { thread_id: "42" } },
  )

  console.log(
    agentSentimentState.messages[agentSentimentState.messages.length - 1].content,
  )

  const apologyState = await agent.invoke(
    { 
      messages: await replyPromptTemplate.formatMessages({})
    },
    { configurable: { thread_id: "42" } },
  )

  console.log(
    apologyState.messages[apologyState.messages.length - 1].content,
  )

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        {apologyState.messages[apologyState.messages.length - 1].content ? 
        <main className="flex flex-col row-start-2 items-center sm:items-start w-full max-w-[1440px]">
            <span className="p-[20px] bg-blue-100 w-full">Q : {REVIEWS.negative}</span>
            <span className="p-[20px]">A : {apologyState.messages[apologyState.messages.length - 1].content.toString().replace(/<think>[\s\S]*?<\/think>/g, '').trim()}</span>
        </main> : <main>loading</main>}
    </div>
  );
}
