import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { loadMcpTools } from '@langchain/mcp-adapters';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { createAgent } from 'langchain';
import { ChatOllama } from '@langchain/ollama';
import client from './_mcp/chromeDevToolsClient';

export default async function DevTools() {

    /*const transport = new StdioClientTransport({
        command: 'npx',
        args: ['-y', 'chrome-devtools-mcp@latest', "--no-usage-statistics"]
    });

    const client = new Client({ version : '', name: 'my-agent' });
    await client.connect(transport);*/

    

    // Load MCP tools as LangChain tools
    const tools = await loadMcpTools('chrome-devtools', client);

    /*const agentModel = new ChatGroq({
        model: "openai/gpt-oss-20b",
        temperature: 0.3,
        maxTokens: 300,
        maxRetries: 2,
    })*/

    const ollamaModel = new ChatOllama({
        model: "qwen3:8b",
        temperature: 0.3,
        maxRetries: 2,
    })

    const agent = createAgent({ model : ollamaModel, tools });

    // Use it
    const result = await agent.invoke({
        messages: [{ role: 'user', content: 'Browse https://news.google.com/home then browse each news link listed and summarize its content' }]
    });

    console.log(
        result.messages[result.messages.length - 1].content,
    )

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <span>content</span>
            <div>
            {"test"}
            </div>
        </main>
        </div>
    );

}