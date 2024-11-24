const userModel = require("../models/user.model");
const cartModel = require("../models/cart.model");
class AdminController {
  async changeRole(req, res) {
    const { id } = req.params;
    try {
      const user = await userModel.findById(id);
      if (!user) {
        res
          .status(404)
          .json({ status: false, message: "usuario no encontrado" });
      }
      const newRole = user.role === "usuario" ? "admin" : "usuario";
      const rolUpdate = await userModel.findByIdAndUpdate(id, {
        role: newRole,
      });
      res.status(200).json({
        status: true,
        message: "Rol actualizado",
        user: rolUpdate,
        role: newRole,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  }

  getAllCarts = async (req, res) => {
    try {
      const carts = await cartModel.find({});
      if (!carts) {
        res.status(404).json({
          status: false,
          message: "carritos de compras no encontrados",
        });
      }
      res.status(201).json({
        status: true,
        message: "Carritos de compras encontrados",
        carritos: carts,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  getCartById = async (req, res) => {
    const { id } = req.params;
    try {
      const cart = await cartModel.findById(id);
      if (!cart) {
        res.status(404).json({
          status: false,
          message: "carritos de compras no encontrados",
        });
      }
      res.status(201).json({
        status: true,
        message: "Carrito de compras encontrado",
        carrito: cart,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  deleteCart = async (req, res) => {
    const { id } = req.params;
    try {
      const deleteCart = await cartModel.findByIdAndDelete(id);
      if (!deleteCart) {
        res.status(404).json({
          status: false,
          message: "carritos de compras no encontrados",
        });
      }
      res
        .status(200)
        .json({
          status: true,
          message: "Carrito de comp´ras eliminado con exito",
          carrito: deleteCart,
        });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };
}

module.exports = AdminController;
