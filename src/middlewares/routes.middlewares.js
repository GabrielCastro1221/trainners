const viewsRoutes = require("../routes/views.routes");
const authRouter = require("../routes/auth.routes");
const userRouter = require("../routes/user.routes");
const adminRouter = require("../routes/admin.routes");
const trainerRouter = require("../routes/trainer.routes");
const productRouter = require("../routes/products.routes");
const cartRouter = require("../routes/cart.routes");
const ticketRouter = require("../routes/ticket.routes");
const postRouter = require("../routes/post.routes");
const multerRouter = require("../routes/multer.routes");

const setupRoutes = (app) => {
  app.use("/", viewsRoutes);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1/trainer", trainerRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/tickets", ticketRouter);
  app.use("/api/v1/post", postRouter);
  app.use("/api/v1", multerRouter);
};

module.exports = setupRoutes;
