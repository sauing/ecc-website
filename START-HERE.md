# Run the ECC website on your own computer

This guide is for **Windows 10 or 11**. You need an internet connection for setup. You do not need ChatGPT or Codex.

You will make a copy of the website and open it in your browser. Your changes stay on your computer; they do not change the live website.

## 1. Install three free tools

Open each link in your browser, download the Windows installer, and open the downloaded file.

| Tool | Download | What to choose |
| --- | --- | --- |
| Node.js — runs the website | [Node.js download](https://nodejs.org/en/download) | Choose **LTS**, Windows, and the **.msi installer**. Keep the usual installer settings. |
| Git — copies the website files | [Git for Windows](https://git-scm.com/install/windows) | Choose the Windows setup download. Keep the usual installer settings. |
| Visual Studio Code — edits files | [VS Code download](https://code.visualstudio.com/download) | Choose the Windows installer. This is **Visual Studio Code**, not Visual Studio. |

Finish all three installations before continuing.

## 2. Open the command window

1. Press the **Windows key** on your keyboard.
2. Type **Command Prompt**.
3. Click **Command Prompt**. A window opens where you can type instructions.

For every command below: copy the line inside the box, paste it into this window, and press **Enter**. Wait until it finishes before typing the next command. Do not copy the box edges or the surrounding explanation.

Check the installations, one line at a time:

```bat
node --version
```

```bat
git --version
```

Both should show a version number. If either says “not recognized,” restart your computer, open Command Prompt again, and try again.

## 3. Copy the website onto your computer

First, go to your personal user folder:

```bat
cd /d "%USERPROFILE%"
```

Copy the website. This is called **cloning**:

```bat
git clone https://github.com/sauing/ecc-website.git
```

Wait for it to finish. If GitHub asks you to sign in, use an account that has access to this repository. If it says “Repository not found,” ask the repository owner for access.

Go into the new website folder:

```bat
cd ecc-website
```

## 4. Install what the website needs

Install the helper called **pnpm**. It downloads the parts this website uses:

```bat
npm install -g pnpm@10
```

Now download those parts. This may take a few minutes:

```bat
pnpm install --frozen-lockfile
```

Wait until the command finishes. You do not need to create an `.env` file or connect a database to view the current demo website.

## 5. Start the website

```bat
pnpm dev
```

When the window says **Ready**, keep it open. Open Chrome, Edge, or another browser and type this into the address bar:

**http://localhost:3000**

You should see the ECC website. The first page may take a little longer to appear.

If the command window shows a different address, such as `http://localhost:3001`, open that address instead.

## 6. Make a small change

1. Open **Visual Studio Code**.
2. Click **File → Open Folder**.
3. Open your personal user folder, then choose **ecc-website**. It contains `package.json` and an `app` folder.
4. If asked whether you trust the folder, continue only if it is the repository you just cloned.
5. In the left file list, open **app → page.tsx**. This is the homepage file.
6. Change a small piece of visible text. Leave the symbols around it alone.
7. Press **Ctrl + S** to save.
8. Look at your browser. The page should update automatically. If it does not, refresh the browser tab.

Made a mistake? Press **Ctrl + Z** in the editor to undo, then save again.

## Stop now and start again later

**To stop:** click the command window and press **Ctrl + C**. If it asks `Terminate batch job (Y/N)?`, type **Y** and press Enter.

**Next time:** open Command Prompt and run these two commands, one at a time:

```bat
cd /d "%USERPROFILE%\ecc-website"
```

```bat
pnpm dev
```

Then open **http://localhost:3000** again. You do not need to clone or install everything again.

## If you get stuck

| What you see | What to do |
| --- | --- |
| “ecc-website already exists” when cloning | The copy is already there. Skip cloning and use the two commands in “Next time” above. If dependencies are missing, run `pnpm install --frozen-lockfile` before `pnpm dev`. |
| “package.json not found” | You are in the wrong folder. Run `cd /d "%USERPROFILE%\ecc-website"`, then try again. |
| “pnpm is not recognized” | Close and reopen Command Prompt. If needed, repeat `npm install -g pnpm@10`. |
| The browser says it cannot connect | Keep the command window open, run `pnpm dev`, wait for **Ready**, and use the address it shows. |
| Startup stops with an upgrade reminder and explicitly says to retry | Run `pnpm dev` once more. Tell the maintainer about the warning so they can handle the upgrade. |
| Another error appears | Copy the error text and ask the repository maintainer for help. Do not delete files or change security settings to fix it. |

Registration, member login and payments are demos. Use made-up details when testing; no real payment is needed.
