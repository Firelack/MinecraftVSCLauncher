const vscode = require('vscode');
const path = require('path');

function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.runMinecraftClient', function () {
    const workspaceFolder = vscode.workspace.workspaceFolders[0];
    const gradlewPath = path.join(workspaceFolder.uri.fsPath, 'gradlew');
    
    const terminal = vscode.window.createTerminal({
      name: "Minecraft Fabric Client",
      cwd: workspaceFolder.uri.fsPath
    });

    terminal.sendText(`${process.platform === 'win32' ? '.\\gradlew' : './gradlew'} runClient`);
    terminal.show();
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
