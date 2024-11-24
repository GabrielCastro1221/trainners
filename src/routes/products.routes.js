const { Router } = require("express");
const ProductController = require("../controllers/products.controller");
const upload = require("../middlewares/multer.middleware");

const router = Router();
const product = new ProductController();

router.post("/", upload.single('img'), product.createProduct);
router.get("/", product.getAllProducts);
router.get("/prods", product.getProds);
router.get("/:id", product.getProductById);
router.put("/:id", product.updateProduct);
router.delete("/:id", product.deleteProduct);

module.exports = router;
