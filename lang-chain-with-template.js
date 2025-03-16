import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatBedrockConverse } from "@langchain/aws";
import fs from "node:fs/promises";
import chalk from "chalk";
import { typeWriter } from "./typewriter.js";

async function readFileContent(filePath = "./data/yosemite.txt") {
  const content = await fs.readFile(filePath, "utf8");
  return content;
}

async function main() {
  const llm = new ChatBedrockConverse({
    model: "meta.llama3-8b-instruct-v1:0",
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
          You're an assitive bot helping me learn about provided context. 
          Only answer if question is related to the privided context. 
          Do not answer unrelated questions.
        `,
    ],
    [
      "human",
      `
      Context: {context}
      --------------------------------
      Question: {question}`,
    ],
  ]);

  const chain = prompt.pipe(llm);
  const response = await chain.invoke({
    context: await readFileContent("./data/yosemite.txt"),
    question: "Tell me about things to do in Yosemite National Park.",
  });

  await typeWriter(chalk.green(response.content));
  const closingMsg = `\n--- Done using ${response.usage_metadata.input_tokens} input tokens and ${response.usage_metadata.output_tokens} output tokens. ---\n`;
  console.log(chalk.yellow(closingMsg));
}

// Run the main function.
main().catch((error) => console.log(chalk.red(`--> ERROR:`, error)));
