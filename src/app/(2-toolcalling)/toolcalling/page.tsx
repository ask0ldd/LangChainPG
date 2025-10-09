import { ChatGroq } from "@langchain/groq";
import addTool from "./_tools/addTool";
import { multiplyTool } from "./_tools/multiplyTool";
// https://js.langchain.com/docs/concepts/tool_calling/
// https://www.youtube.com/watch?v=pi3C6y4gWFA
// https://github.com/in-tech-gration/LangChain.js

export default async function ToolCalling() {
  const grodModel = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.3,
    maxTokens: 100,
    maxRetries: 2,
  })

  const toolsByName = {
    add: addTool,
    multiply: multiplyTool,
  }

  const modelWithTools = grodModel.bindTools([multiplyTool, addTool])

  const resultMessage = await modelWithTools.invoke("What is 12 multiplied by 3?")

  console.log("result : ", JSON.stringify(resultMessage))


  /* 
    why can i access tool_calls outside of kwargs :

    LangChain’s AIMessage (and other message objects) unpack kwargs fields into the message instance itself. This is usually done with object spreading in the constructor, like:

    class AIMessage {
      constructor(kwargs) {
        Object.assign(this, kwargs);
        this.kwargs = kwargs;
      }
    }

    That means this.tool_calls is just a direct alias for kwargs.tool_calls.
  */
  if(resultMessage.tool_calls){
    for (const toolCall of resultMessage.tool_calls) {
      const toolName = toolCall.name
      const selectedTool = toolsByName[toolName as keyof typeof toolsByName]
      const toolMessage = await selectedTool.invoke(toolCall)
      console.log(`Calling the ${toolCall.name} tool.`)
      console.log(JSON.stringify(toolMessage.content))
      // messages.push(toolMessage);
    }
  }

  // console.log(resultMessage.response_metadata.tokenUsage.totalTokens)

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <span>content</span>
        <div>
          {JSON.stringify(resultMessage)}
        </div>
      </main>
    </div>
  );
}

/*
{
  "lc": 1,
  "type": "constructor",
  "id": [
    "langchain_core",
    "messages",
    "AIMessage"
  ],
  "kwargs": {
    "content": "",
    "additional_kwargs": {
      "tool_calls": [
        {
          "id": "2xzn0r5hz",
          "type": "function",
          "function": {
            "name": "multiply",
            "arguments": "{\"a\":12,\"b\":3}"
          }
        }
      ]
    },
    "tool_calls": [
      {
        "name": "multiply",
        "args": {
          "a": 12,
          "b": 3
        },
        "type": "tool_call",
        "id": "2xzn0r5hz"
      }
    ],
    "invalid_tool_calls": [],
    "usage_metadata": {
      "input_tokens": 1169,
      "output_tokens": 87,
      "total_tokens": 1256
    },
    "response_metadata": {
      "tokenUsage": {
        "completionTokens": 87,
        "promptTokens": 1169,
        "totalTokens": 1256
      },
      "finish_reason": "tool_calls",
      "id": "chatcmpl-675ca260-a16f-4026-9eea-c60fbd8fbd6c",
      "object": "chat.completion",
      "created": 1758494544,
      "model": "gemma2-9b-it",
      "usage": {
        "queue_time": 0.189595651,
        "prompt_tokens": 1169,
        "prompt_time": 0.022275626,
        "completion_tokens": 87,
        "completion_time": 0.158181818,
        "total_tokens": 1256,
        "total_time": 0.180457444
      },
      "usage_breakdown": null,
      "system_fingerprint": "fp_10c08bf97d",
      "x_groq": {
        "id": "req_01k5q72m91fy3t65kjm02tds48"
      },
      "service_tier": "on_demand"
    }
  }
}
*/