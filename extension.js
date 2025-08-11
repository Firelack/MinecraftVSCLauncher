const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * Checks whether the given workspace folder is a Gradle project
 * by looking for the presence of a gradle.properties file.
 * 
 * @param {vscode.WorkspaceFolder} workspaceFolder - The folder to check.
 * @returns {boolean} - True if gradle.properties exists, false otherwise.
 */
function isGradleProject(workspaceFolder) {
  const gradlePropsPath = path.join(workspaceFolder.uri.fsPath, 'gradle.properties');
  return fs.existsSync(gradlePropsPath);
}

/**
 * Updates the VS Code context key `minecraft.isGradleProject`
 * so that commands and buttons can be conditionally shown
 * depending on whether the open workspace is a Gradle project.
 */
async function checkGradleProjectContext() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  
  // No folder open → project is not Gradle
  if (!workspaceFolder) {
    vscode.commands.executeCommand('setContext', 'minecraft.isGradleProject', false);
    return;
  }

  const exists = isGradleProject(workspaceFolder);
  vscode.commands.executeCommand('setContext', 'minecraft.isGradleProject', exists);
}

/**
 * Retrieves an existing terminal with the given name, or creates a new one.
 * 
 * @param {string} name - The terminal name to look for or assign.
 * @param {string} cwd - The working directory for the terminal.
 * @returns {vscode.Terminal} - The existing or newly created terminal.
 */
function getOrCreateTerminal(name, cwd) {
  const existing = vscode.window.terminals.find(t => t.name === name);
  if (existing) {
    return existing;
  }
  return vscode.window.createTerminal({ name, cwd });
}

/**
 * Runs a Gradle command inside a named terminal.
 * The terminal will be reused if it already exists.
 * 
 * @param {string} command - The Gradle task to run (e.g., 'build', 'runClient').
 * @param {'build'|'run'} type - Determines which terminal to use.
 */
function runGradleCommand(command, type) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  // No workspace open
  if (!workspaceFolder) {
    vscode.window.showErrorMessage("No workspace folder is open.");
    return;
  }

  // Not a Gradle project
  if (!isGradleProject(workspaceFolder)) {
    vscode.window.showErrorMessage("Missing gradle.properties. Make sure this is a valid Minecraft mod project.");
    return;
  }

  // Choose terminal name based on task type
  const terminalName = type === 'run' ? "Minecraft Client" : "Minecraft Build";
  const terminal = getOrCreateTerminal(terminalName, workspaceFolder.uri.fsPath);

  // Run the Gradle command (platform-specific syntax)
  const gradleCmd = process.platform === 'win32' ? '.\\gradlew' : './gradlew';
  terminal.sendText(`${gradleCmd} ${command}`);
  terminal.show(false);
}

/**
 * Called when the extension is activated.
 * Registers commands and sets up the Gradle project detection.
 * 
 * @param {vscode.ExtensionContext} context - The extension context.
 */
function activate(context) {
  // Initial Gradle detection
  checkGradleProjectContext();

  // Re-check Gradle status when workspace folders change
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(checkGradleProjectContext)
  );

  // Command: Run Minecraft Client
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runMinecraftClient', () => {
      runGradleCommand('runClient', 'run');
    })
  );

  // Command: Build Minecraft Project
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.buildMinecraftProject', () => {
      runGradleCommand('build', 'build');
    })
  );

  // Command: Build + Run (no waiting between tasks)
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.buildAndRunMinecraft', () => {
      runGradleCommand('build', 'build');
      runGradleCommand('runClient', 'run');
    })
  );

  // Command: Show menu of Minecraft actions
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.showMinecraftMenu', async () => {
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
    })
  );
}

/**
 * Called when the extension is deactivated.
 * Currently unused, but available for cleanup logic.
 */
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
