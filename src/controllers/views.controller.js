const trainerModel = require("../models/trainer.model");
const Product = require("../models/product.model");
const postModel = require("../models/post.model");
const CartRepository = require("../repositories/cart.repository");
const DTO = require("../dto/userDto");
const userModel = require("../models/user.model");

const cartR = new CartRepository();

class ViewsController {
  renderHome = (req, res) => {
    try {
      res.render("home");
    } catch (err) {
      res.render("404");
    }
  };

  renderTrainers = async (req, res) => {
    try {
      const trainers = await trainerModel
        .find({ isApproved: "approved" })
        .lean();
      if (!trainers || trainers.length === 0) {
        return res.status(404).render("trainers", {
          status: false,
          message: "No se encontraron entrenadores",
          entrenadores: [],
        });
      }
      res.render("trainers", {
        status: true,
        entrenadores: trainers,
      });
    } catch (err) {
      res.render("404");
    }
  };

  renderTrainersDetail = async (req, res) => {
    const { id } = req.params;
    try {
      const trainer = await trainerModel.findById(id).lean();
      if (!trainer) {
        return res.status(404).json({
          status: false,
          message: "Entrenador no encontrado",
        });
      }
      res.render("trainerDetail", {
        trainer,
      });
    } catch (err) {
      res.render("404");
    }
  };

  renderLogin = (req, res) => {
    try {
      res.render("login");
    } catch (err) {
      res.render("404");
    }
  };

  renderChangePass = (req, res) => {
    try {
      res.render("changePass");
    } catch (err) {
      res.render("404");
    }
  };

  renderResetPass = (req, res) => {
    try {
      res.render("resetPass");
    } catch (err) {
      res.render("404");
    }
  };

  renderStore = async (req, res) => {
    try {
      const { page = 1, limit = 6, sort, query } = req.query;
      const skip = (page - 1) * limit;
      let queryOptions = {};
      if (query) {
        queryOptions = { category: query };
      }
      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort === "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }
      const products = await Product.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
      const totalProducts = await Product.countDocuments(queryOptions);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const newArray = products.map((producto) => {
        const { _id, ...rest } = producto.toObject();
        return { id: _id, ...rest };
      });
      let cartId = null;
      if (req.user) {
        cartId = req.user.cart ? req.user.cart.toString() : null;
      }
      res.render("store", {
        productos: newArray,
        hasPrevPage,
        hasNextPage,
        prevPage: hasPrevPage ? parseInt(page) - 1 : null,
        nextPage: hasNextPage ? parseInt(page) + 1 : null,
        currentPage: parseInt(page),
        totalPages,
        limit,
        sort,
        query,
        cartId,
      });
    } catch (error) {
      res.render("404");
    }
  };

  renderProductDetail = async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findById(id).lean();
      if (!product) {
        return res.status(404).render("error", {
          message: "Producto no encontrado",
        });
      }
      const cartId = req.user.cart.toString();
      res.render("productDetail", { product, cartId });
    } catch (err) {
      res.render("404");
    }
  };

  renderContact = (req, res) => {
    try {
      res.render("contact");
    } catch (err) {
      res.render("404");
    }
  };

  renderBlog = (req, res) => {
    try {
      res.render("blog");
    } catch (err) {
      res.render("404");
    }
  };

  renderPostDetail = async (req, res) => {
    const { id } = req.params;
    try {
      const post = await postModel.findById(id).lean();
      if (!post) {
        return res.status(404).send({
          message: "Publicación no encontrada",
        });
      }
      res.render("postDetail", {
        title: post.title_one,
        title_two: post.title_two,
        description: post.desc_one,
        description_two: post.desc_two,
        imageUrl: post.img,
      });
    } catch (err) {
      res.render("404");
    }
  };

  renderUserProfile = async (req, res) => {
    try {
      const user = await userModel.findById(req.user.id).lean();
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "Usuario no encontrado",
        });
      }
      res.render("userProfile", {
        user,
      });
    } catch (err) {
      res.render("404");
    }
  };

  getTrainerProfile = async (req, res) => {
    const trainerId = req.userId;
    if (!trainerId) {
      return res.status(400).render("error", {
        success: false,
        message: "ID del entrenador no proporcionado",
      });
    }
    try {
      const trainer = await trainerModel.findById(trainerId);
      if (!trainer) {
        return res.status(404).render("error", {
          success: false,
          message: "Entrenador no encontrado",
        });
      }
      const { password, ...rest } = trainer._doc;
      res.status(200).render("trainerProfile", {
        success: true,
        message: "Información del perfil obtenida satisfactoriamente",
        data: {
          ...rest,
        },
      });
    } catch (error) {
      res.render("404");
    }
  };

  renderAdmin = (req, res) => {
    try {
      res.render("admin");
    } catch (err) {
      res.render("404");
    }
  };

  renderCart = async (req, res) => {
    const cartId = req.params.cid;
    try {
      const cart = await cartR.obtenerProductosDeCarrito(cartId);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      let totalPurchase = 0;
      const productInCart = cart.products.map((item) => {
        const product = item.product.toObject();
        const quantity = item.quantity;
        const totalPrice = product.price * quantity;
        totalPurchase += totalPrice;
        return { product: { ...product, totalPrice }, quantity, cartId };
      });
      res.render("cart", {
        productos: productInCart,
        totalPurchase,
        cartId,
      });
    } catch (error) {
      res.render("404");
    }
  };

  renderTicket = (req, res) => {
    try {
      res.render("ticket");
    } catch (err) {
      res.render("404");
    }
  };

  renderTrainerRegister = (req, res) => {
    try {
      res.render("trainerRegister");
    } catch (err) {
      res.render("404");
    }
  };

  renderUserRegister = (req, res) => {
    try {
      res.render("userRegister");
    } catch (err) {
      res.render("404");
    }
  };

  render404 = (req, res) => {
    try {
      res.render("404");
    } catch (err) {
      res.render("404");
    }
  };
  
  renderResetPass = (req, res) => {
    try {
      res.render("resetPass");
    } catch (err) {
      res.render("404");
    }
  };
  
  renderPasswordChange = (req, res) => {
    try {
      res.render("passwordChange");
    } catch (err) {
      res.render("404");
    }
  };

  renderSuccess = (req, res) => {
    try {
      res.render("success");
    } catch (err) {
      res.render("404");
    }
  };
}

module.exports = ViewsController;
