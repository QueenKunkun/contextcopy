import * as vscode from 'vscode';

function getContext(editor: vscode.TextEditor) {
	const document = editor.document;
	const selection = editor.selection;

	const relativePath = vscode.workspace.asRelativePath(document.uri, false);
	const startLine = selection.start.line + 1;
	const endLine = selection.end.line + 1;
	const lineInfo = startLine === endLine ? `${startLine}` : `${startLine}-${endLine}`;
	const code = selection.isEmpty
		? document.lineAt(selection.active.line).text
		: document.getText(selection);

	return { relativePath, lineInfo, code, language: document.languageId };
}

function getFence(code: string): string {
	const longest = Math.max(0, ...([...code.matchAll(/`+/g)].map(m => m[0].length)));
	return '`'.repeat(Math.max(3, longest + 1));
}

function getLanguageFromUri(uri: vscode.Uri): string {
	const ext = uri.path.split('.').pop() ?? '';
	const map: Record<string, string> = {
		ts: 'typescript', tsx: 'tsx', js: 'javascript', jsx: 'jsx',
		py: 'python', rb: 'ruby', go: 'go', rs: 'rust', java: 'java',
		c: 'c', cpp: 'cpp', cs: 'csharp', php: 'php', swift: 'swift',
		kt: 'kotlin', md: 'markdown', json: 'json', yaml: 'yaml', yml: 'yaml',
		toml: 'toml', sh: 'bash', html: 'html', css: 'css', scss: 'scss',
		sql: 'sql', xml: 'xml',
	};
	return map[ext] ?? ext;
}

async function readFilesAsMarkdown(uris: vscode.Uri[]): Promise<{ text: string; count: number }> {
	const parts: string[] = [];
	for (const uri of uris) {
		try {
			const bytes = await vscode.workspace.fs.readFile(uri);
			const content = Buffer.from(bytes).toString('utf8');
			const relativePath = vscode.workspace.asRelativePath(uri, false);
			const language = getLanguageFromUri(uri);
			const fence = getFence(content);
			parts.push(`File: ${relativePath}\n\n${fence}${language}\n${content}\n${fence}`);
		} catch {
			// skip unreadable files (e.g. binaries)
		}
	}
	return { text: parts.join('\n\n---\n\n'), count: parts.length };
}

async function readFilesAsPlain(uris: vscode.Uri[]): Promise<{ text: string; count: number }> {
	const parts: string[] = [];
	for (const uri of uris) {
		try {
			const bytes = await vscode.workspace.fs.readFile(uri);
			const content = Buffer.from(bytes).toString('utf8');
			const relativePath = vscode.workspace.asRelativePath(uri, false);
			parts.push(`// ${relativePath}\n\n${content}`);
		} catch {
			// skip unreadable files
		}
	}
	return { text: parts.join('\n\n---\n\n'), count: parts.length };
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('contextcopy.copy', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) { return; }

			const { relativePath, lineInfo, code } = getContext(editor);
			await vscode.env.clipboard.writeText(`// ${relativePath}:${lineInfo}\n\n${code}`);
			vscode.window.showInformationMessage(`Copied ${relativePath}:${lineInfo}`);
		}),

		vscode.commands.registerCommand('contextcopy.copyMarkdown', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) { return; }

			const { relativePath, lineInfo, code, language } = getContext(editor);
			const fence = getFence(code);
			await vscode.env.clipboard.writeText(
				`File: ${relativePath}\nLines: ${lineInfo}\n\n${fence}${language}\n${code}\n${fence}\n`
			);
			vscode.window.showInformationMessage(`Copied ${relativePath}:${lineInfo}`);
		}),

		vscode.commands.registerCommand('contextcopy.copyFiles', async (_uri: vscode.Uri, uris: vscode.Uri[]) => {
			const targets = uris?.length ? uris : (_uri ? [_uri] : []);
			if (!targets.length) { return; }

			const { text, count } = await readFilesAsPlain(targets);
			if (!count) { vscode.window.showWarningMessage('No readable files selected.'); return; }
			await vscode.env.clipboard.writeText(text);
			vscode.window.showInformationMessage(`Copied ${count} file${count > 1 ? 's' : ''}`);
		}),

		vscode.commands.registerCommand('contextcopy.copyFilesMarkdown', async (_uri: vscode.Uri, uris: vscode.Uri[]) => {
			const targets = uris?.length ? uris : (_uri ? [_uri] : []);
			if (!targets.length) { return; }

			const { text, count } = await readFilesAsMarkdown(targets);
			if (!count) { vscode.window.showWarningMessage('No readable files selected.'); return; }
			await vscode.env.clipboard.writeText(text);
			vscode.window.showInformationMessage(`Copied ${count} file${count > 1 ? 's' : ''} as Markdown`);
		})
	);
}

export function deactivate() {}
