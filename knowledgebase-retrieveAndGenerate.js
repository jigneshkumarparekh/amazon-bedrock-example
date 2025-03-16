"use strict";
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import chalk from "chalk";
import { typeWriter } from "./typewriter.js";

// Create a new Bedrock Runtime client instance.
const client = new BedrockAgentRuntimeClient({
  region: "us-east-1",
  // configure creds here.
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const params = {
  input: {
    text: "Tell me about the things to do in Yosemite national park.",
  },
  retrieveAndGenerateConfiguration: {
    knowledgeBaseConfiguration: {
      knowledgeBaseId: "SDVMPGBAHC",
      modelArn: "meta.llama3-8b-instruct-v1:0",
    },
    type: "KNOWLEDGE_BASE",
  },
};

const command = new RetrieveAndGenerateCommand(params);

try {
  const response = await client.send(command);
  typeWriter(chalk.green("Retrieved data:", response.output.text));
} catch (error) {
  console.error("Error retrieving data:", error);
}
