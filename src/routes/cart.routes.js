const { Router } = require("express");
const CartController = require("../controllers/cart.controller");

const router = Router();
const cart = new CartController();

router.post("/", cart.createCart);
router.get("/:id", cart.getProductsToCart);
router.post("/:cid/product/:pid", cart.addProductsToCart);
router.delete("/:cid/product/:pid", cart.deleteProductToCart);
router.put("/:cid", cart.updateProductsToCart);
router.put("/:cid/product/:pid", cart.updateQuantity);
router.delete("/:cid", cart.emptyCart);
router.post("/:cid/purchase", cart.finishPurchase);

module.exports = router;
