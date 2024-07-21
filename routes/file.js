
const express = require("express");
const router = express.Router();
const fileController = require("../controller/file");
const uploadFile = require("../middlewares/multer");
router.post("/file/upload",uploadFile.single("file"), fileController.fileUpload);

router.get("/files/:uuid", fileController.getLink);

router.get("/files/download/:uuid", fileController.fileDownload);

router.post("/api/files/send", fileController.sendEmail);

module.exports = router;
