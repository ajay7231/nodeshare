const File = require("./models/file");
const fs = require("fs");
const connectDb = require("./config/db");

connectDb();

deleteEntry = async () => {
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
};

deleteEntry().then(process.exit);
