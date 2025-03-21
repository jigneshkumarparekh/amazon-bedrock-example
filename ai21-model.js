import {
  BedrockRuntimeClient,
  InvokeModelCommand,
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

  // Prepare the payload for the model.
  const payload = {
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 500,
    top_p: 0.4, // Probability... Lower the number, higher is the matching probability. For ex: 0.2 => 20% of matching responses.
    temperature: 0.5, // Choose a lower value to influence the model to select higher-probability outputs.
  };

  // Invoke the model with the payload and wait for the response.
  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId,
  });
  const apiResponse = await client.send(command);

  // Decode and return the response(s).
  const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
  /** @type {ResponseBody} */
  const responseBody = JSON.parse(decodedResponseBody);
  return responseBody;
}

async function readFileContent(filePath = "./data/yosemite.txt") {
  const content = await fs.readFile(filePath, "utf8");
  return content;
}

async function main() {
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

  const prompt = `
    Context: 
      You're an assitive bot helping me learn about following context. Only answer if question is related to the privided context. Do not answer unrelated questions. 
  
      ${await readFileContent(file)}
    
    Question: ${query}
  `;
  const modelId = "ai21.jamba-instruct-v1:0";
  console.log(`Prompt: ${prompt}`);
  console.log(chalk.redBright(`Model ID: ${modelId}`));

  try {
    console.log("-".repeat(53));
    const response = await invokeModel(prompt, modelId);
    typeWriter(
      chalk.green(`Answer: \n${response.choices[0].message.content}\n`)
    );
  } catch (err) {
    console.log(err);
  }
}

main().catch((error) => console.log(chalk.red(`--> ERROR:`, error)));
