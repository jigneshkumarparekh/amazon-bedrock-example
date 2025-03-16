"use strict";
import {
  BedrockAgentRuntimeClient,
  RetrieveCommand,
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
  knowledgeBaseId: "SDVMPGBAHC", // Knowledge base ID for knowledge-base-quick-start-8fg4c
  retrievalQuery: {
    text: "Tell me about the things to do in Yosemite national park.",
  },
};

const command = new RetrieveCommand(params);

try {
  const response = await client.send(command);
  typeWriter(chalk.green("Retrieved data:", response));
} catch (error) {
  console.error("Error retrieving data:", error);
}
