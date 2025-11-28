# Minecraft VSC Launcher

Quickly run or build your Minecraft Fabric/Forge mods directly from VSCode — no need to touch the terminal. You can also start dataGeneration and other commands easily.

---

## 🚀 Features

- Adds a button in the top editor title bar.
- Runs `./gradlew runClient` or `.\gradlew runClient` in the terminal.
- Runs `./gradlew build` to build the project directly from the menu.
- Runs `./gradlew runDatagen` to start dataGeneration
- Runs `./gradlew stop` to stop daemon.
- Runs `./gradlew dependencies --refresh-dependencies` to refresh dependencies
- Supports build and run in one action (build the project, then launch the client automatically).
- Works with Fabric and Forge mod projects using Gradle.
- Automatically opens a terminal in the current workspace folder.
- Warns the user if `gradle.properties` is missing.

---

## 📦 Requirements

- A Minecraft mod project using **Gradle** (Fabric or Forge).
- The project folder must contain:
  - a `gradlew` executable (`gradle.properties` or `build.gradle` is necessary)
- The VSCode workspace must be open at the root of the mod project.

---

## 🛠 How to Use

1. Open your Minecraft mod folder in VSCode.
2. Open any file (the button appears in the top-right editor toolbar).
3. Click the **"Run Minecraft Client"** button.
4. A terminal will open and run the project with `./gradlew runClient`.
5. Use more button to acced other commands.

---

## 💻 Installation

- Open the Extensions panel in VSCode (Ctrl+Shift+X)
- Search for "Minecraft Launcher Button"
- Click Install to add the extension to your editor

---

## 📦 Future improvements

This project is a work in progress. If you have any suggestions, feel free to reach out to me!

---

### Created by Firelack

[GitHub Repository](https://github.com/Firelack/MinecraftVSCLauncher)
