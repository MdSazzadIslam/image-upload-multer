const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

const fs = require("fs");
const path = require("path");
const dir = "./images";

const app = express();
app.use(express.json());
app.use(cors());
//Bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, "./images");
    },
    filename: function (req, file, callback) {
      callback(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(/*res.end('Only images are allowed')*/ null, false);
    }
    callback(null, true);
  },
});

app.post("/api/single", upload.single("image"), (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .send({ success: false, msg: "Only image are allowed" });
    } else {
      res.status(201).send({ success: true, msg: "File uploaded sucessfully" });
    }
  } catch (err) {
    res.status(500).send({ success: false, msg: err.message });
  }
});

app.post("/api/multi", upload.array("image", 5), (req, res, next) => {
  try {
    if (!req.files) {
      return res
        .status(400)
        .send({ success: false, msg: "Only image are allowed" });
    } else {
      res.status(201).send({ success: true, msg: "File uploaded sucessfully" });
    }
  } catch (err) {
    res.status(500).send({ success: false, msg: err.message });
  }
});

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
