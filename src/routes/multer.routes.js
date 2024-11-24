const { Router } = require("express");
const upload = require("../middlewares/multer.middleware");
const MulterController = require("../controllers/multer.controller");

const multer = new MulterController();
const router = Router();

router.post("/upload", upload.single("imagen"), multer.uploadFile);

module.exports = router;
