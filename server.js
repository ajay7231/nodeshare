const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const deleteEntry = require("./expire");
const fs = require("fs");
const dir = "./uploads";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
//app.use(express.json());
app.use(bodyParser.json());
const connectDb = require("./config/db");
connectDb();

// templates
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));

app.listen(PORT, () => {
  console.log(`listening on port : ${PORT}`);
});

fs.readdir(dir, (err, files) => {
  console.log(files.length);
});
