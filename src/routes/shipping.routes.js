const { Router } = require("express");
const ShippingController = require("../controllers/shipping.controller");

const router = Router();
const shipping = new ShippingController();

router.post("/", shipping.createShipping);
router.get("/", shipping.getAllShippings);
router.get("/:id", shipping.getShippingById);
router.put("/:id", shipping.updateShipping);
router.delete("/:id", shipping.deleteShipping);
router.put("/status/:id", shipping.changeStatus);
router.put("/paid/:id", shipping.changePaid);

module.exports = router;
