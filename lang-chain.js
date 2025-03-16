import { ChatBedrockConverse } from "@langchain/aws";
import { typeWriter } from "./typewriter.js";
import chalk from "chalk";

const llm = new ChatBedrockConverse({
  model: "meta.llama3-8b-instruct-v1:0",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const aiMsg = await llm.invoke([
  [
    "system",
    "You are a helpful assistant that translates English to German. Translate the user sentence.",
  ],
  ["human", "I love programming."],
]);

typeWriter(chalk.green(aiMsg.content));

const closingMsg = `--> Done using ${aiMsg.usage_metadata.input_tokens} input tokens and ${aiMsg.usage_metadata.output_tokens} output tokens.`;
console.log(chalk.green(closingMsg));
