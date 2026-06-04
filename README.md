# ContextCopy

Copy code snippets with file path and line numbers — ready to paste into ChatGPT, Claude, or any code review.

## Features

Two commands, both available via the Command Palette (`Cmd+Shift+P`):

**Copy Code Context** — plain format, great for inline references:

```
// src/utils/parser.ts:42-48

const result = parse(input);
```

**Copy Markdown Context** — fenced code block with language, great for AI chats and GitHub:

````
File: src/utils/parser.ts
Lines: 42-48

```typescript
const result = parse(input);
```
````

Both commands work with or without a selection — if nothing is selected, the current line is copied.

## Usage

1. Open a file in the editor
2. Select some code (or just place your cursor on a line)
3. Open the Command Palette (`Cmd+Shift+P`)
4. Run **Copy Code Context** or **Copy Markdown Context**
5. Paste anywhere

## License

MIT
