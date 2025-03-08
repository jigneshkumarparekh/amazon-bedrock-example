import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import chalk from "chalk";
import util from "node:util";

/**
 * Invokes a Bedrock agent to run an inference using the input
 * provided in the request body.
 *
 * @param {string} prompt - The prompt that you want the Agent to complete.
 * @param {string} sessionId - An arbitrary identifier for the session.
 */
export const invokeBedrockAgent = async (prompt, sessionId) => {
  const client = new BedrockAgentRuntimeClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const agentId = "EUZHKMDUKL"; // demo-agent
  const agentAliasId = "YYZX5YZKRH"; // Alias for v1.

  const command = new InvokeAgentCommand({
    agentId,
    agentAliasId,
    sessionId,
    inputText: prompt,
  });

  try {
    let completion = "";
    const response = await client.send(command);

    if (response.completion === undefined) {
      throw new Error("Completion is undefined");
    }

    for await (const chunkEvent of response.completion) {
      const chunk = chunkEvent.chunk;
      const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
      completion += decodedResponse;
    }

    return completion;
  } catch (err) {
    console.error(err);
  }
};

function processArguments() {
  // Accept the query from user
  const args = process.argv.slice(2);
  const options = {
    query: {
      type: "string",
      short: "q",
    },
  };
  const { values } = util.parseArgs({ args, options });
  const { query, file } = values;

  if (!query) {
    console.log(
      chalk.red(
        'Missing input. Please provide "--query". For ex: --query "Tell me about things to do in Yosemite"'
      )
    );
    process.exit(0);
  }

  return { query };
}

// Call function to process the arguments and invoke the agent.
const { query } = processArguments();
const result = await invokeBedrockAgent(
  query,
  `Session-${Date.now().toString()}`
);
console.log(chalk.green(`--> Response from model: ${result}`));
