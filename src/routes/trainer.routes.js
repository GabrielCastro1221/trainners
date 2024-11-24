const { Router } = require("express");
const TrainerController = require("../controllers/trainer.controller");
const upload = require("../middlewares/multer.middleware");

const router = Router();
const trainer = new TrainerController();

router.post("/", upload.single('photo'), trainer.createTrainer);
router.get("/", trainer.getAllTrainers);
router.get("/:id", trainer.getTrainerById);
router.put("/:id", trainer.updateTrainer);
router.put("/:id/status", trainer.changeStatus);
router.delete("/:id", trainer.deleteTrainer);

module.exports = router;
