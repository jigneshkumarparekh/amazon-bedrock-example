import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { typeWriter } from "./typewriter.js";

async function invokeModel(prompt, modelId = "ai21.jamba-instruct-v1:0") {
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
        role: "assistant",
        content: prompt,
      },
    ],
    max_tokens: 256,
    top_p: 0.8,
    temperature: 0.7,
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

const prompt = `
  Context: 
    Here are the login information for develop environments:

    1. Login info for dev1: user-dev1@test.com/dev1@123 
    2. Login info for dev2: user-dev2@test.com/dev2@123
    3. Login info for dev3: user-dev3@test.com/dev3@123
  
  Question: Can you predict the login for dev4?
`;
const modelId = "ai21.jamba-instruct-v1:0";
console.log(`Prompt: ${prompt}`);
console.log(`Model ID: ${modelId}`);

try {
  console.log("-".repeat(53));
  const response = await invokeModel(prompt, modelId);
  typeWriter(`Answer: \n${response.choices[0].message.content}`);
} catch (err) {
  console.log(err);
}
