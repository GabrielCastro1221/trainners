const { Router } = require("express");
const PostController = require("../controllers/post.controller");
const upload = require("../middlewares/multer.middleware");

const router = Router();
const post = new PostController();

router.post("/", upload.single("img"), post.createPost);
router.get("/", post.getAllPost);
router.get("/:id", post.getPostById);
router.put("/:id", post.updatePost);
router.delete("/:id", post.deletePost);
router.put("/like/:id", post.likePost);
router.post("/comment/:id", post.addComment);
router.put("/update/:id", post.updatePost);

module.exports = router;
