# Amazon Bedrock Example

This reporsitory contains an example code of Amazon Bedrock with node.js

## Pre-requisites:

- node `v18+`
- AWS Access Key and Secret Key generated and configured in your bash file like `~/.zshrc` or `.bashprofile` with following environement variables:
  - AWS_ACCESS_KEY_ID: <YOUR_AWS_ACCESS_KEY>
  - AWS_SECRET_ACCESS_KEY: <YOUR_AWS_SECRET_ACCESS_KEY>
- Access to the AI21 Jamba-instruct model in your AWS console.

### Usage:

Under the `data` directory, there are files `yosemite.txt` and `dogs.txt which contains information about Yosemite National Park and dogs respectively.
The bot is instructed to answer questions about provided context only and asked not to answer unrelated question.

Here how you can use:

```
node ai21-model.js --query "Tell me about the things to do in Yosemite National Park." --file ./data/yosemite.txt
```

--- OR ---

```
node llama-model.js --query "Tell me about the different types of dogs" --file ./data/dogs.txt
```

If you ask any unrelated question, then it won't answer:

```

node llama-model.js --query "Tell me the best practices on JS" --file ./data/yosemite.txt

```
