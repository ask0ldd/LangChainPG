import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";
import { END, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import itemIdentificationTool from "./_tools/itemIdentificationTool";
import orderRetrievalTool from "./_tools/orderRetrievalTool";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { Runnable } from "@langchain/core/runnables";
import faqTool from "./_tools/faqTool";

// --- Graph Logic ---
function buildGraph(model: Runnable, tools:  DynamicStructuredTool[]) {
    const toolNode = new ToolNode(tools)

    const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", async (state) => {
        const response = await model.invoke(state.messages)
        return { messages: [response] }
    })
    .addNode("tools", toolNode)

    workflow
    .addEdge(START, "agent")
    .addConditionalEdges("agent", ({ messages }) => {
        const last = messages[messages.length - 1] as AIMessage
        return last.tool_calls?.length ? "tools" : END
    })
    .addEdge("tools", "agent")

    return workflow.compile()
}

// --- Model and Tool Setup ---
function createModelWithTools() {
    const tools = [itemIdentificationTool, orderRetrievalTool, faqTool];
    const model = new ChatGroq({
        model: "gemma2-9b-it",
        temperature: 0.7,
        maxTokens: 1000,
        maxRetries: 2,
    }).bindTools(tools);

    return { model, tools };
}

const itemSuggestionsPromptTemplate = ChatPromptTemplate.fromMessages([
    ["system", `You are an e-commerce sales assistant whose primary goal is to inform, engage, and convert. Always present our products in the most appealing and trustworthy way to maximize the chance of completing a sale. Your tone should be confident, helpful, and polished — you are a top-performing seller representing our brand at its best.

If a user asks for order details, use the appropriate system tools to provide accurate and complete information. When accessing order data, do not include honorific titles (like Mr., Ms., etc.) before the last name when calling the tool. After giving the user all the infos of the order including a list of the purchased items, you should thank him once again for his purchase. Always address the user using its firstname and no lastname to create a sense of proximity.

If a user requests advice or recommendations, use the available tools to find all items matching their preferences. Then, explain each suggestion with clear benefits and persuasive reasoning that helps the user make an informed decision. Be friendly, professional, and persuasive while guiding the conversation toward a confident purchase decision.`],
    ["human", `the user's request : {request}`],
]);


export default async function Graph() {
   
    const { model, tools } = createModelWithTools();

    const compiledGraph = buildGraph(model, tools)

    // const itemDescription = "I would like to buy a hoodie that i could wear running during the winter."
    // const request = "I would like to buy a short what are my best options?"
    // const request = "What was my last order and for which total price? I am Ms. Rossi."
    const request = "Can i promote your brand and get some affiliate revenues?"

    // Use the graph
    const finalState = await compiledGraph.invoke({ 
      messages: await itemSuggestionsPromptTemplate.formatMessages({request})
    })
    const finalReply = finalState.messages[finalState.messages.length - 1].content
    console.log(finalReply.toString())

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        {finalReply ? 
        <main className="flex flex-col row-start-2 items-center sm:items-start w-full max-w-[1440px]">
            <span className="p-[20px] bg-blue-100 w-full">Q : {request}</span>
            <span className="p-[20px]">A : {finalReply.toString()}</span>
        </main> : <main>loading</main>}
        </div>
    );
}