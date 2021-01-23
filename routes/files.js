const router = require("express").router();
const multer = require("multer");
const path = require("path");

const File = require("../models/file");
const { v4: uuid4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random * 1e8
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limits: { fieldSize: 100 * 1024 * 1024 },
}).single("myfile");

router.post("/", (res, res) => {

  upload(req, res, async (err) => {

    if (!req.file) {
      return res.json({ error: "All values are required" });
    }

    if (err) {
      return res.status(500).send({ error: err.message });
    }

    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();
    return response.json({
      file: `${process.env.APP_URL}/files/${response.uuid}`,
    });
  });
});

module.exports = router;
