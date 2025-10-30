import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";
import { END, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import orderRetrievalTool from "./_tools/orderRetrievalTool";

// https://js.langchain.com/docs/tutorials/chatbot/

export default async function Chatbot() {

    const tools = [orderRetrievalTool]
    const model = new ChatGroq({
        model: "openai/gpt-oss-20b",
        temperature: 0.3,
        maxTokens: 300,
        maxRetries: 2,
    }).bindTools(tools)

    const toolNode = new ToolNode(tools)

    // Define graph nodes
    const workflow = new StateGraph(MessagesAnnotation)
        .addNode("agent", callModel)
        .addNode("tools", toolNode)

    // define graph edges
    workflow
        .addEdge(START, "agent") // __start__ is a special name for the entrypoint
        .addConditionalEdges("agent", shouldContinue)
        .addEdge("tools", "agent")

    const compiledGraph = workflow.compile()

    const sentimentPromptTemplate = ChatPromptTemplate.fromMessages([
        ["system", "You are a customer feedback analysis assistant."],
        ["human", `Rate the following review: "{review}". Simply output the adjective best describing the sentiment associated with the review.`]
    ]);

    const negativeReview = "The product is far too large. It doesn't seem the match an european XL size."

    // Use the graph
    const finalState = await compiledGraph.invoke({ 
      messages: await sentimentPromptTemplate.formatMessages({review : negativeReview})
    })
    const finalMessage = finalState.messages[finalState.messages.length - 1].content ?? ''
    console.log(finalMessage)

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <span>content</span>
            <div>
            {finalMessage.toString()}
            </div>
        </main>
        </div>
    );

    // Define the function that determines whether to continue or not
    function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
        const lastMessage = messages[messages.length - 1] as AIMessage

        // If the LLM makes a tool call, then we route to the "tools" node
        if (lastMessage.tool_calls?.length) {
            return "tools"
        }
        // Otherwise, we stop (reply to the user) using the special END node
        return END
    }

    // Define the function that calls the model
    async function callModel(state: typeof MessagesAnnotation.State) {
        const response = await model.invoke(state.messages)

        // We return a list, because this will get added to the existing list
        return { messages: [response] }
    }
}