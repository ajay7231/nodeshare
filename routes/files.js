const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const File = require("../models/file");
const { v4: uuid4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e8
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limits: { fieldSize: 100 * 1024 * 1024 },
}).single("myfile");

router.post("/", (req, res) => {
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
    return res.json({
      file: `${process.env.APP_URL}/files/${response.uuid}`,
    });
  });
});

//Email services

router.post("/send", async (req, res) => {
  //validate

  const { uuid, emailTo, emailFrom } = req.body;
  console.log(req.body);

  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are required" });
  }

  // get data

  const file = await File.findOne({ uuid: uuid });

  if (file.sender) {
    return res.status(422).send({ error: "You can only send email once" });
  }
  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();

  //send email

  const sendMail = require("../services/emailService");
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "nodeshare filecloud",
    text: "",
    html: require("../services/emailTemp")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_URL}/files/${uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 hours",
    }),
  });
  return res.send({ success: "Email already sent" });
});

module.exports = router;
