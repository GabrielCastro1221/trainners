const { Router } = require("express");
const UserController = require("../controllers/user.controller");

const router = Router();
const user = new UserController();

router.post("/requestPasswordReset", user.RequestPasswordReset);
router.post("/reset-password", user.resetPassword);
router.get("/", user.getAllUsers);
router.get("/:id", user.getUserById);
router.put("/:id", user.updateUser);
router.delete("/:id", user.deleteUser);

module.exports = router;
