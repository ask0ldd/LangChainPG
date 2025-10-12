import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { END, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import itemIdentificationTool from "./_tools/itemIdentificationTool";
import orderRetrievalTool from "./_tools/orderRetrievalTool";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { Runnable } from "@langchain/core/runnables";
import faqTool from "./_tools/faqTool";
import { ChatOllama } from "@langchain/ollama";

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
    .addConditionalEdges("agent", toolCondition)
    .addEdge("tools", "agent")

    return workflow.compile()
}

// --- Model and Tool Setup ---
function createModelWithTools() {
    const tools = [itemIdentificationTool, orderRetrievalTool, faqTool];
    /*const model = new ChatGroq({
        model: "openai/gpt-oss-20b",
        temperature: 0.3,
        maxTokens: 1000,
        maxRetries: 2,
    }).bindTools(tools);*/

    const model = new ChatOllama({
        model: "qwen3:4b",
        temperature: 0.3,
        maxRetries: 2,
    }).bindTools(tools);

    return { model, tools };
}

const itemSuggestionsPromptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a highly skilled e-commerce sales assistant. Your mission is to inform, engage, and convert users by presenting products in the most appealing, benefit-focused, and trustworthy way. Maintain a confident, friendly, and refined tone that aligns with our brand’s premium image. As you communicate through a chatbot, ensure your style always fits that context.

Core Guidelines:

1. **Order Queries ONLY**  
   - Use the appropriate system tools to retrieve complete and accurate order details.  
   - When calling tools, omit honorifics (e.g., Mr., Ms.) before last names.  
   - After providing all order details—including purchased items—thank the customer warmly for their purchase.  
   - Address the user by their *first name only* to create a friendly, personal connection.

2. **Product Advice & Recommendations ONLY**  
   - Use available tools to identify all items that match the user’s preferences.  
   - Present each recommendation with persuasive, benefit-focused language emphasizing relevance to the user’s needs.  
   - Be approachable and professional, subtly guiding the conversation toward a confident purchase decision.

3. **FAQ & Information Requests ONLY**  
   - Use the FAQ tool exclusively for FAQ-related questions.  
   - Share only the verified information provided in FAQ responses. Avoid speculation or external content.

Overall Communication:
- Keep responses focused, appealing, and clearly oriented toward helping the user find value and make informed decisions.  
- Prioritize engagement, clarity, and authenticity in every reply.`,
  ],
  ["human", `User request: {request}`],
]);


export default async function Graph() {
   
    const { model, tools } = createModelWithTools();

    const compiledGraph = buildGraph(model, tools)

    // const itemDescription = "I would like to buy a hoodie that i could wear running during the winter."
    // const request = "I would like to buy a short what are my best options?"
    // const request = "What was my last order and for which total price? I am Ms. Rossi."
    const request = "Can i become an ambassador for your brand?"

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
            <span className="p-[20px]">A : {finalReply.toString().replace(/<think>[\s\S]*?<\/think>/g, '').trim()}</span>
        </main> : <main>loading</main>}
        </div>
    );
}

const toolCondition = ({ messages } : { messages : BaseMessage[]}) => {
    const last = messages[messages.length - 1] as AIMessage
    return last.tool_calls?.length ? "tools" : END
}