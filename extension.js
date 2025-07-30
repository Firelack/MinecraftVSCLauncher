const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.runMinecraftClient', async function () {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage("No workspace folder is open.");
      return;
    }

    const gradlePropsPath = path.join(workspaceFolder.uri.fsPath, 'gradle.properties');

    if (!fs.existsSync(gradlePropsPath)) {
      vscode.window.showErrorMessage("Missing gradle.properties. Make sure this is a valid Minecraft mod project.");
      return;
    }

    const terminal = vscode.window.createTerminal({
      name: "Minecraft Client",
      cwd: workspaceFolder.uri.fsPath,
    });

    const gradleCmd = process.platform === 'win32' ? '.\\gradlew' : './gradlew';
    terminal.sendText(`${gradleCmd} runClient`);
    terminal.show();
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
