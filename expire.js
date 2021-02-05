// const File = require("./models/file");
// //const fs = require("fs");
// const connectDb = require("./config/db");

// module.exports = () => {
//   connectDb();

//   deleteEntry = () => {
//     // const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const files = File.find();
//     if (files.length > 1) {
//       for (const file of files) {
//         try {
//           //fs.unlinkSync(file.path);

//           file.remove();
//           console.log(`successfully removed ${file.filename} `);
//         } catch (error) {
//           console.log(`Error while removing ${error}`);
//         }
//       }
//       console.log("removing done");
//     }
//   };

//   deleteEntry().then(process.exit);
// };
