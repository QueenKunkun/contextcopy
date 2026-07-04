# ContextCopy

Copy code snippets with file path and line numbers — ready to paste into ChatGPT, Claude, or any code review.

## Features

### Copy from Editor

Two commands available via the Command Palette (`Cmd+Shift+P`):

**Copy Code Context** — plain format, great for inline references:

```
// /Users/apple/project/src/utils/parser.ts:42-48

const result = parse(input);
```

**Copy Markdown Context** — fenced code block with language, great for AI chats and GitHub:

````
File: /Users/apple/project/src/utils/parser.ts
Lines: 42-48

```typescript
const result = parse(input);
```
````

Both commands work with or without a selection — if nothing is selected, the current line is copied.

### Copy Multiple Files from Explorer

Right-click any file (or multi-select with `Cmd+Click`) in the Explorer panel → **ContextCopy** submenu:

**Copy File(s)** — plain format, one file per section:

```
// /Users/apple/project/src/utils/parser.ts

<full file contents>

---

// src/utils/lexer.ts

<full file contents>
```

**Copy File(s) as Markdown** — fenced blocks with language tags, ideal for AI context:

````
File: /Users/apple/project/src/utils/parser.ts

```typescript
<full file contents>
```

---

File: src/utils/lexer.ts

```typescript
<full file contents>
```
````

## Install (from market)

1. Download from [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=KristinZhang.contextcopy) or
2. Download from [openvsx](https://open-vsx.org/extension/KristinZhang/contextcopy)

## Install (from source)

```bash
pnpm install
pnpm run compile
```

Then press `F5` in VS Code to launch the Extension Development Host, or package with `vsce package`.

## Usage

**Editor commands:**
1. Open a file, select some code (or place cursor on a line)
2. `Cmd+Shift+P` → **Copy Code Context** or **Copy Markdown Context**
3. Paste anywhere

**Multi-file copy:**
1. In the Explorer, select files (`Cmd+Click` for multiple)
2. Right-click → **ContextCopy** → **Copy File(s)** or **Copy File(s) as Markdown**
3. Paste into your AI chat

## License

MIT
