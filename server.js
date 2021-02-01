const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const cron = require("node-cron");
const File = require("./models/file");
const fs = require("fs");
const connectDb = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
//app.use(express.json());
app.use(bodyParser.json());

connectDb();

// templates
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));

cron.schedule("0 2 * * *", async function () {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const files = await File.find({ createdAt: { $lt: pastDate } });
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);

        await file.remove();
        console.log(`successfully removed ${file.filename} `);
      } catch (error) {
        console.log(`Error while removing ${error}`);
      }
    }
    console.log("removing done");
  }
});

app.listen(PORT, () => {
  console.log(`listening on port : ${PORT}`);
});
