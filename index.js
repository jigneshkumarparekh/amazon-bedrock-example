import {
  BedrockClient,
  ListFoundationModelsCommand,
} from "@aws-sdk/client-bedrock";

const client = new BedrockClient({
  region: "us-east-1",
  // configure creds here.
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const command = new ListFoundationModelsCommand({});

const response = await client.send(command);
const models = response.modelSummaries;

const activeModels = models.filter((m) => m.modelLifecycle.status === "ACTIVE");
console.log("Listing the available Bedrock foundation models:");
for (let model of activeModels) {
  console.log("=".repeat(42));
  console.log(` Model: ${model.modelId}`);
  console.log("-".repeat(42));
  console.log(` Name: ${model.modelName}`);
  console.log(` Provider: ${model.providerName}`);
  console.log(` Model ARN: ${model.modelArn}`);
  console.log(` Input modalities: ${model.inputModalities}`);
  console.log(` Output modalities: ${model.outputModalities}`);
  console.log(` Supported customizations: ${model.customizationsSupported}`);
  console.log(` Supported inference types: ${model.inferenceTypesSupported}`);
  console.log(` Lifecycle status: ${model.modelLifecycle.status}`);
  console.log("=".repeat(42) + "\n");
}
