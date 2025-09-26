import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
// https://js.langchain.com/docs/concepts/tool_calling/
// https://www.youtube.com/watch?v=pi3C6y4gWFA
// https://github.com/in-tech-gration/LangChain.js
// https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/?ajs_aid=4c487466-0b7f-4925-96a6-a76122227d21#making-your-first-agent-using-langgraph

export default async function Chat() {

  const groqChatModel = new ChatGroq({
    model: "gemma2-9b-it",
    temperature: 0.7,
    maxTokens: 100,
    maxRetries: 2,
  })

  /* 
    Let’s first use the model directly. ChatModels are instances of LangChain Runnables, which means they expose a standard interface 
    for interacting with them. To simply call the model, we can pass in a list of messages to the .invoke method.
  */
  const messages = [
    new SystemMessage("Translate the following from English to French."), // !!! what is a system message ?!
    new HumanMessage("I'm learning how to use the Langchain framework."),
  ];

  const resultMessage = await groqChatModel.invoke(messages);

  console.log(resultMessage.content)

  /* 
    ChatModels receive message objects as input and generate message objects as output. In addition to text content, 
    message objects convey conversational roles and hold important data, such as tool calls and token usage counts.
    
    AIMessage {
      "id": "chatcmpl-AekSfJkg3QIOsk42BH6Qom4Gt159j",
      "content": "Ciao!",
      "additional_kwargs": {},
      "response_metadata": {
        "tokenUsage": {
          "promptTokens": 20,
          "completionTokens": 3,
          "totalTokens": 23
        },
        "finish_reason": "stop",
        "usage": {
          "prompt_tokens": 20,
          "completion_tokens": 3,
          "total_tokens": 23,
          "prompt_tokens_details": {
            "cached_tokens": 0,
            "audio_tokens": 0
          },
          "completion_tokens_details": {
            "reasoning_tokens": 0,
            "audio_tokens": 0,
            "accepted_prediction_tokens": 0,
            "rejected_prediction_tokens": 0
          }
        },
        "system_fingerprint": "fp_6fc10e10eb"
      },
      "tool_calls": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "output_tokens": 3,
        "input_tokens": 20,
        "total_tokens": 23,
        "input_token_details": {
          "audio": 0,
          "cache_read": 0
        },
        "output_token_details": {
          "audio": 0,
          "reasoning": 0
        }
      }
    }
  */

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
