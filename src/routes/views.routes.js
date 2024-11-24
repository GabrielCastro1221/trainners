const { Router } = require("express");
const ViewsController = require("../controllers/views.controller");
const checkRole = require("../middlewares/checkRole");

const router = Router();
const views = new ViewsController();

router.get("/",  views.renderHome);
router.get("/login", views.renderLogin);
router.get("/registro/entrenador", views.renderTrainerRegister);
router.get("/user-register", views.renderUserRegister);
router.get("/entrenadores",  views.renderTrainers);
router.get("/entrenadores/:id",  views.renderTrainersDetail);
router.get("/tienda",  views.renderStore);
router.get("/producto/:id",  views.renderProductDetail);
router.get("/contacto", views.renderContact);
router.get("/blog", views.renderBlog);
router.get("/post/:id", views.renderPostDetail);
router.get("/perfil-usuario", checkRole(["usuario"]), views.renderUserProfile);
router.get("/perfil-entrenador", checkRole(["entrenador"]), views.getTrainerProfile);
router.get("/admin", checkRole(["admin"]), views.renderAdmin);
router.get("/cart/:cid", views.renderCart);
router.get("/page-not-found", views.render404);
router.get("/reset-password", views.renderResetPass);
router.get("/change-password", views.renderPasswordChange);
router.get("/success", views.renderSuccess);
router.get("/ticket/:cid/purchase", checkRole(["usuario", "entrenador"]), views.renderTicket);

module.exports = router;
