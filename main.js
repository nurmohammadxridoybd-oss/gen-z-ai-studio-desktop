const { app, BrowserWindow, shell, session } = require("electron");

const WEBSITE_URL = "https://gen-z-aistudio.netlify.app/";

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1000,
    minHeight: 650,

    title: "Gen Z AI Studio",

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    },

    autoHideMenuBar: true,
    show: false
  });

  win.once("ready-to-show", () => {
    win.show();
  });

  win.loadURL(WEBSITE_URL);

  // External links open in the normal browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(WEBSITE_URL)) {
      shell.openExternal(url);
      return { action: "deny" };
    }

    return { action: "allow" };
  });

  // Prevent accidental navigation away from your website
  win.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(WEBSITE_URL)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

app.whenReady().then(() => {
  // Allow the website to work normally inside Electron
  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      const allowedPermissions = [
        "camera",
        "microphone",
        "notifications",
        "clipboard-read",
        "clipboard-sanitized-write"
      ];

      callback(allowedPermissions.includes(permission));
    }
  );

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});