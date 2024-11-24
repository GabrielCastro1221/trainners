const CartRepository = require("../repositories/cart.repository");
const userModel = require("../models/user.model");
const ticketModel = require("../models/ticket.model");
const { ticketNumberRandom, totalPurchase } = require("../utils/cartUtils");
const MailerController = require("../service/mailer.services");

const cartR = new CartRepository();
const mailer = new MailerController();

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await cartR.createCart();
      res.status(200).json({
        status: true,
        message: "carrito creado con exito",
        carrito: newCart,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al crear carrito",
        error: error.message,
      });
    }
  }

  async getProductsToCart(req, res) {
    const { id } = req.params;
    try {
      const products = await cartR.obtenerProductosDeCarrito(id);
      if (!products) {
        return res
          .status(404)
          .json({ stataus: false, message: "Carrito no encontrado" });
      }
      res.status(200).json({
        status: true,
        message: "productos obtenidos",
        productos: products,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al obtener productos del carrito",
        error: error.message,
      });
    }
  }

  async addProductsToCart(req, res) {
    const { cid } = req.params;
    const { pid } = req.params;
    const quantity = req.body.quantity || 1;
    try {
      await cartR.addProductInCart(cid, pid, quantity);
      const idCart = req.user.cart.toString();
      /*res
        .status(200)
        .json({ status: true, message: "Producto agregado al carrito" });*/
      //res.redirect(`https://olympia-alternativa.onrender.com/cart/${idCart}`);
      res.redirect(`/cart/${idCart}`);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al agregar productos al carrito",
        error: error.message,
      });
    }
  }

  async deleteProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      const updatedCart = await cartR.deleteProductInCart(cartId, productId);
      res.status(200).json({ "Producto eliminado del carrito": updatedCart });
    } catch (error) {
      res.status(500).send("Error al eliminar producto del carrito");
    }
  }

  async updateProductsToCart(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    try {
      const updatedCart = await cartR.UpdateQuantity(cartId, updatedProducts);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).send("Error al actualizar productos en el carrito");
    }
  }

  async updateQuantity(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;
    try {
      const updatedCart = await cartR.UpdateQuantity(
        cartId,
        productId,
        newQuantity
      );
      res.status(200).json({
        status: true,
        message: "Stock actualizado",
        stock: updatedCart,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al actualizar el stock del carrito",
        error: error.message,
      });
    }
  }

  async emptyCart(req, res) {
    const cartId = req.params.cid;
    try {
      const updatedCart = await cartR.emptyCart(cartId);
      res
        .status(200)
        .json({ status: true, message: "Carrito vacio", carrito: updatedCart });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al vaciar carrito",
        error: error.message,
      });
    }
  }

  async finishPurchase(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartR.obtenerProductosDeCarrito(cartId);
      const userWithCart = await userModel.findOne({ cart: cartId });
      const date = new Date();
      const ticket = new ticketModel({
        code: ticketNumberRandom(),
        amount: totalPurchase(cart.products),
        purchaser: userWithCart._id,
        purchase_datetime: date,
      });
      await ticket.save();
      await mailer.enviarCorreoCompra(userWithCart.email, userWithCart.first_name, ticket._id);
      await cartR.emptyCart(cartId);
      res.render("ticket", {
        ticket: {
          code: ticket.code,
          purchaser: userWithCart.email,
          amount: ticket.amount,
        },
        status: true,
        message: "Orden compra generada con éxito",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al comprar productos",
        error: error.message,
      });
    }
  }
}

module.exports = CartController;
