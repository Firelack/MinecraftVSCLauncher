# Minecraft VSC Launcher

A simple Visual Studio Code extension that adds a button to launch Minecraft mod projects (Fabric or Forge) via the `./gradlew runClient` command.

---

## 🚀 Features

- Adds a button in the top editor title bar.
- Runs `./gradlew runClient` or `.\gradlew runClient` in the terminal.
- New: Runs `./gradlew build` to build the project directly from the menu.
- New: Supports build and run in one action (build the project, then launch the client automatically).
- Works with Fabric and Forge mod projects using Gradle.
- Automatically opens a terminal in the current workspace folder.
- Warns the user if `gradle.properties` is missing.

---

## 📦 Requirements

- A Minecraft mod project using **Gradle** (Fabric or Forge).
- The project folder must contain:
  - a `gradlew` executable,
  - a `gradle.properties` file (recommended).
- The VSCode workspace must be open at the root of the mod project.

---

## 🛠 How to Use

1. Open your Minecraft mod folder in VSCode.
2. Open any file (the button appears in the top-right editor toolbar).
3. Click the **"Run Minecraft Client"** button.
4. A terminal will open and run the project with `./gradlew runClient`.

---

## 💻 Installation

- Open the Extensions panel in VSCode (Ctrl+Shift+X)
- Search for "Minecraft Launcher Button"
- Click Install to add the extension to your editor

---

## 📦 Future improvements

- Improve menu with button and better arrow
This project is a work in progress. If you have any suggestions, feel free to reach out to me!

---

### Created by Firelack

[GitHub Repository](https://github.com/Firelack/MinecraftVSCLauncher)
