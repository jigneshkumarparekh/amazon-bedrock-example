# Amazon Bedrock Example

This reporsitory contains an example code of Amazon Bedrock with node.js

## Pre-requisites:

node v18+

## How to run:

Here is how to run JS file which invokes the model:

```
node invoke-model.js
```

### Usage:

Under the `data` directory, there is a file `yosemite.txt` which contains information about Yosemite National Park.
The bot is instructed to answer questions about Yosemite NP only and asked not to answer unrelated question.

Here how you can use:

```
node invoke-model.js --query "Provide me the list of things TODO in Yosemite"
```

If you ask any unrelated question, then it won't answer:

```

node invoke-model.js --query "Tell me the best practices on JS"

```
