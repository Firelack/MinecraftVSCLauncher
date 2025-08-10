const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

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

/**
 * Retourne un terminal existant avec le même nom ou en crée un nouveau.
 */
function getOrCreateTerminal(name, cwd) {
  // Chercher un terminal déjà ouvert avec le même nom
  let existing = vscode.window.terminals.find(t => t.name === name);
  if (existing) {
    return existing;
  }

  // Sinon, on en crée un nouveau
  return vscode.window.createTerminal({ name, cwd });
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

  let terminalName = type === 'run' ? "Minecraft Client" : "Minecraft Build";
  const terminal = getOrCreateTerminal(terminalName, workspaceFolder.uri.fsPath);

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

  // Commande : Build + Run (deux terminaux séparés, simultanés)
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
  // Ne pas disposer → on veut les garder même après désactivation/redémarrage
}

module.exports = {
  activate,
  deactivate
};
