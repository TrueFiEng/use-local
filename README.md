# use-local

Copies package files from local directory to the node_modules.

## Usage

Assuming you are in a project that makes use of a library that you are also developing locally:

```bash
../../../../use-local/bin.js ../../../useDApp/packages/core
```

Will copy package files from `useDApp/packages/core` to the installation location at `node_modules` under CWD.
