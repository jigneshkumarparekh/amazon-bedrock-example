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
        role: "user",
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
    Here are the guidelines for JavaScript coding:

    Formatting and Style
      Indentation: Use 2 or 4 spaces for indentation (choose one and be consistent). Avoid tabs.
      Semicolons: Always use semicolons to terminate statements.
      Line Length: Keep lines under 80-100 characters for readability.
      Naming: Use descriptive names for variables, functions, and classes. Follow camelCase for variables and functions, and PascalCase for classes.
      Quotes: Use single quotes for strings unless the string contains a single quote.
      Comments: Write clear, concise comments to explain the purpose of code blocks and complex logic.
    
    Best Practices
      Use const and let: Prefer const for variables that shouldn't change, and let for variables that can. Avoid var.
      Arrow Functions: Use arrow functions for concise syntax, especially for short callback functions.
      Template Literals: Use template literals for string interpolation and multi-line strings.
      Destructuring: Use destructuring to extract values from objects and arrays.
      Modules: Use modules to organize code and manage dependencies (e.g., using ES Modules or CommonJS).
      Strict Mode: Use strict mode ('use strict') to enforce better code practices.
      Avoid Global Variables: Minimize the use of global variables to prevent naming collisions.
      Asynchronous Code: Use promises or async/await to handle asynchronous operations in a clean and readable way.
      Error Handling: Implement proper error handling using try...catch blocks.
      Code Linting: Use a linter like ESLint to enforce code style and catch potential errors.
      Testing: Write unit tests to ensure code quality and prevent regressions.
      
    New Features (ES2024)
      Temporal API:
        Use the Temporal API for advanced date and time manipulation, if available in your environment.
      Other ES2024 Features:
        Stay updated with the latest ECMAScript features and use them where appropriate.
      Important Considerations
        Accessibility: Write code that is accessible to all users, including those with disabilities.
        Performance: Optimize code for performance, especially for web applications.
        Security: Follow security best practices to protect against vulnerabilities.
  
  Question: Give me some best practices for JavaScript?
`;
const modelId = "ai21.jamba-instruct-v1:0";
console.log(`Prompt: ${prompt}`);
console.log(`Model ID: ${modelId}`);

try {
  console.log("-".repeat(53));
  const response = await invokeModel(prompt, modelId);
  typeWriter(`Answer: \n${response.choices[0].message.content}\n`);
} catch (err) {
  console.log(err);
}
