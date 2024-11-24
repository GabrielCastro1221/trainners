const productModel = require("../models/product.model");
const { v4: uuidv4 } = require("uuid");
const ProductRepository = require("../repositories/products.repository");

const productR = new ProductRepository();

class ProductController {
  createProduct = async (req, res) => {
    const { title, description, price, stock, category } = req.body;
    const img = req.file ? req.file.path : null;
    try {
      if (!title || !description || !price || !img || !stock || !category) {
        return res.status(400).json({
          status: false,
          message: "Todos los campos son obligatorios",
        });
      }
      const newProd = new productModel({
        title,
        description,
        price,
        img,
        stock,
        category,
        code: uuidv4(),
      });
      await newProd.save();
      return res.status(201).json({
        status: true,
        message: "Producto creado con éxito",
        producto: newProd,
      });
    } catch (err) {
      console.error("Error al crear producto:", err);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  getProds = async (req, res) => {
    try {
      const prods = await productModel.find({});
      if (!prods) {
        res
          .status(404)
          .json({ status: false, message: "Productos no encontrados" });
      }
      res.status(201).json({
        status: true,
        message: "Productos encontrados",
        productos: prods,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  getAllProducts = async (req, res) => {
    try {
      let { limit = 10, page = 1, sort, query } = req.query;
      limit = parseInt(limit);
      page = parseInt(page);
      const prods = await productR.getProducts(limit, page, sort, query);
      res.status(200).json({
        status: true,
        message: "Productos encontrados",
        productos: prods,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al obtener productos",
        error: error.message,
      });
    }
  };

  getProductById = async (req, res) => {
    const { id } = req.params;
    try {
      const product = await productModel.findById(id);
      if (!product) {
        res
          .status(404)
          .json({ status: false, message: "Productos no encontrados" });
      }
      res.status(200).json({
        status: true,
        message: "Producto encontrado",
        producto: product,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
      const updateProd = await productModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      if (!updateProd) {
        res
          .status(404)
          .json({ status: false, message: "Productos no encontrados" });
      }
      res.status(200).json({
        status: true,
        message: "producto actualizado con exito",
        producto: updateProd,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
      const deleteProd = await productModel.findByIdAndDelete(id);
      if (!deleteProd) {
        res
          .status(404)
          .json({ status: false, message: "Productos no encontrados" });
      }
      res.status(200).json({
        status: true,
        message: "Producto eliminado con exito",
        producto: deleteProd,
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

module.exports = ProductController;
