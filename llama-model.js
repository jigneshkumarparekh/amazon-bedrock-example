import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import fs from "node:fs/promises";
import chalk from "chalk";
import util from "node:util";
import { typeWriter } from "./typewriter.js";

async function invokeModel(prompt, modelId) {
  // Create a new Bedrock Runtime client instance.
  const client = new BedrockRuntimeClient({
    region: "us-east-1",
    // configure creds here.
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const conversation = [
    {
      role: "user",
      content: [{ text: prompt }],
    },
  ];

  // Instructions for the bot.
  const systemPrompt = [
    {
      text: `
        You're an assitive bot helping me learn about provided context. 
        Only answer if question is related to the privided context. 
        Do not answer unrelated questions.
      `,
    },
  ];

  // Create a command with the model ID, the message, and a basic configuration.
  const command = new ConverseCommand({
    modelId,
    messages: conversation,
    system: systemPrompt,
    inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
  });

  const apiResponse = await client.send(command);

  // Extract the response text.
  const responseText = apiResponse.output.message.content[0].text;
  return responseText;
}

async function readFileContent(filePath = "./data/yosemite.txt") {
  const content = await fs.readFile(filePath, "utf8");
  return content;
}

function processArguments() {
  // Accept the query from user
  const args = process.argv.slice(2);
  const options = {
    query: {
      type: "string",
      short: "q",
    },
    file: {
      type: "string",
      short: "f",
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

  if (!file) {
    console.log(
      chalk.red(
        'Missing input. Please provide "--file". For ex: --file "./data/yosemite.txt"'
      )
    );
    process.exit(0);
  }

  return { query, file };
}

async function main() {
  const { query, file } = processArguments();
  const prompt = `
    Context: 
      ${await readFileContent(file)}
    
    Question: ${query}
  `;
  const modelId = "meta.llama3-8b-instruct-v1:0";
  console.log(`Prompt: ${prompt}`);
  console.log(chalk.redBright(`Model ID: ${modelId}`));

  try {
    console.log("-".repeat(53));
    const response = await invokeModel(prompt, modelId);
    typeWriter(chalk.green(`Answer: \n${response}\n`));
  } catch (err) {
    console.log(err);
  }
}

main().catch((error) => console.log(chalk.red(`--> ERROR:`, error)));
