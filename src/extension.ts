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
				`File: ${relativePath}\nLines: ${lineInfo}\n\n${fence}${language}\n${code}\n${fence}`
			);
			vscode.window.showInformationMessage(`Copied ${relativePath}:${lineInfo}`);
		})
	);
}

export function deactivate() {}
