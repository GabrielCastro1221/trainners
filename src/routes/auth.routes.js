const { Router } = require("express");
const AuthController = require("../controllers/auth.controller");
const passport = require("passport");
const upload = require("../middlewares/multer.middleware")

const router = Router();
const auth = new AuthController();

router.post("/register", upload.single('photo'), auth.register);
router.post("/login", auth.login);
router.post("/logout", auth.logout);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  auth.getUserProfile
);
router.get(
  "/trainer-profile",

  auth.getTrainerProfile
);

module.exports = router;
