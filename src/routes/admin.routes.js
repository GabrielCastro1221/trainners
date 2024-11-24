const { Router } = require("express");
const AdminController = require("../controllers/admin.controller");

const router = Router();
const admin = new AdminController();

router.put("/rol/:id", admin.changeRole);
router.get("/carts", admin.getAllCarts);
router.get("/carts/:id", admin.getCartById);
router.delete("/carts/:id", admin.deleteCart);

module.exports = router;
