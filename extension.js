const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

let minecraftRunTerminal;
let minecraftBuildTerminal;

function isGradleProject(workspaceFolder) {
  const gradlePropsPath = path.join(workspaceFolder.uri.fsPath, 'gradle.properties');
  return fs.existsSync(gradlePropsPath);
}

async function checkGradleProjectContext() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.commands.executeCommand('setContext', 'minecraft.isGradleProject', false);
    return;
  }

  const exists = isGradleProject(workspaceFolder);
  vscode.commands.executeCommand('setContext', 'minecraft.isGradleProject', exists);
}

function getOrCreateTerminal(name, cwd, existingTerminalRef) {
  if (!existingTerminalRef || existingTerminalRef.exitStatus) {
    return vscode.window.createTerminal({ name, cwd });
  }
  return existingTerminalRef;
}

function runGradleCommand(command, type) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage("No workspace folder is open.");
    return;
  }

  if (!isGradleProject(workspaceFolder)) {
    vscode.window.showErrorMessage("Missing gradle.properties. Make sure this is a valid Minecraft mod project.");
    return;
  }

  let terminal;
  if (type === 'run') {
    minecraftRunTerminal = getOrCreateTerminal("Minecraft Client", workspaceFolder.uri.fsPath, minecraftRunTerminal);
    terminal = minecraftRunTerminal;
  } else if (type === 'build') {
    minecraftBuildTerminal = getOrCreateTerminal("Minecraft Build", workspaceFolder.uri.fsPath, minecraftBuildTerminal);
    terminal = minecraftBuildTerminal;
  }

  const gradleCmd = process.platform === 'win32' ? '.\\gradlew' : './gradlew';
  terminal.sendText(`${gradleCmd} ${command}`);
  terminal.show(false);
}

function activate(context) {
  checkGradleProjectContext();

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(checkGradleProjectContext)
  );

  // Commande : Run Minecraft
  context.subscriptions.push(vscode.commands.registerCommand('extension.runMinecraftClient', () => {
    runGradleCommand('runClient', 'run');
  }));

  // Commande : Build Project
  context.subscriptions.push(vscode.commands.registerCommand('extension.buildMinecraftProject', () => {
    runGradleCommand('build', 'build');
  }));

  // Commande : Build + Run
  context.subscriptions.push(vscode.commands.registerCommand('extension.buildAndRunMinecraft', () => {
    runGradleCommand('build', 'build');
    runGradleCommand('runClient', 'run');
  }));

  // Menu déroulant
  context.subscriptions.push(vscode.commands.registerCommand('extension.showMinecraftMenu', async () => {
    const choice = await vscode.window.showQuickPick(
      [
        { label: "▶ Run Minecraft Client", command: 'extension.runMinecraftClient' },
        { label: "🔨 Build Project", command: 'extension.buildMinecraftProject' },
        { label: "🛠️ Build + Run", command: 'extension.buildAndRunMinecraft' }
      ],
      { placeHolder: "Select an action" }
    );

    if (choice) {
      vscode.commands.executeCommand(choice.command);
    }
  }));
}

function deactivate() {
  if (minecraftRunTerminal) minecraftRunTerminal.dispose();
  if (minecraftBuildTerminal) minecraftBuildTerminal.dispose();
}

module.exports = {
  activate,
  deactivate
};
