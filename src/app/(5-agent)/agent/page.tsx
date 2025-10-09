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
    ["system", "You are a customer feedback analysis assistant."],
    ["human", `Rate the following review: "{review}".`]
  ]);

  const replyPromptTemplate = ChatPromptTemplate.fromMessages([
    ["human", "If the review is negative, respond with a brief apology. If it is positive, reply with a short thank-you message. All messages should be 3-liners and as specific as possible."]
  ]);

  const negativeReview = "The product is far too large. It doesn't seem the match an european XL size."
  const positiveReview = "The product match the picture as it is beautiful and stylish."
  const agentSentimentState = await agent.invoke(
    { 
      messages: await sentimentPromptTemplate.formatMessages({review : negativeReview})
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
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <span>content</span>
        <div>
          LangGraph
        </div>
      </main>
    </div>
  );
}
