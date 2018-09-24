const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

let win;
var Dat = require("dat-node");

var lineReader = require("readline").createInterface({
  input: require("fs").createReadStream("partner/chat.txt")
});

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 });

  Dat(
    "partner/",
    {
      // 2. Tell Dat what link I want
      key: "8ca50009b4a49d24d6a8a996cc79b4a2732ed0702d5e792d2b598572a4fa5a8f" // (a 64 character hash from above)
    },
    function(err, dat) {
      if (err) throw err;

      // 3. Join the network & download (files are automatically downloaded)
      dat.joinNetwork();

      lineReader.on("line", function(line) {
        console.log("Line from file:", line);
      });
    }
  );

  //win.loadFile("index.html");

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file",
      slashes: true
    })
  );

  win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", () => {
  //mainWindow = new createWindow();
  createWindow();
});
app.on("windows-window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
