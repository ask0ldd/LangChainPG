import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const transport = new StdioClientTransport({
    command: 'npx',
    args: ['-y', 'chrome-devtools-mcp@latest', '--no-usage-statistics', '--isolated']
});

const client = new Client({ version : '', name: 'my-agent' });
await client.connect(transport);

export default client