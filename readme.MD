# Minecraft VSC Launcher

A simple Visual Studio Code extension that adds a button to launch Minecraft mod projects (Fabric or Forge) via the `./gradlew runClient` command.

---

## 🚀 Features

- Adds a button in the top editor title bar.
- Runs `./gradlew runClient` or `.\gradlew runClient` in the terminal.
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

Option 1 :

1) Download the latest release
2) In VSCode, press Ctrl+Shift+P and run :
Extension: Install from VSIX...
3) Select the VSIX file

Option 2 :

1) Download or clone this repo (`git clone https://github.com/Firelack/MinecraftVSCLauncher.git`)
2) In VSCode, press Ctrl+Shift+P and run :
Developer: Install Extension from Location...
3) Select the folder MinecraftVSCLauncher

---

## 📦 Future improvements

This project is a work in progress. If you have any suggestions, feel free to reach out to me!

---

### Created by Firelack

[GitHub Repository](https://github.com/Firelack/MinecraftVSCLauncher)
