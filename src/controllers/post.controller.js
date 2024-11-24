const postModel = require("../models/post.model");
const { fechaPost } = require("../utils/date");

class PostController {
  createPost = async (req, res) => {
    const { category, title_one, desc_one, title_two, desc_two } = req.body;
    const img = req.file ? req.file.path : null;

    try {
      if (!img || !category || !title_one || !desc_one) {
        res
          .status(400)
          .json({ status: false, message: "debes completar todos los campos" });
      }
      const newPost = new postModel({
        img,
        category,
        post_date: fechaPost,
        title_one,
        desc_one,
        title_two, 
        desc_two
      });
      await newPost.save();
      res.status(200).json({
        status: true,
        message: "Publicacion creada con exito",
        puclicacion: newPost,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  getAllPost = async (req, res) => {
    try {
      const posts = await postModel.find({}).lean();
      if (posts.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Publicaciones no encontradas",
        });
      }
      res.status(200).json({
        status: true,
        message: "Publicaciones encontradas con éxito",
        publicaciones: posts,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  getPostById = async (req, res) => {
    const { id } = req.params;
    try {
      const post = await postModel.findById(id);
      if (!post) {
        res
          .status(404)
          .json({ status: false, message: "Publicacion no encontrada" });
      }
      res.status(201).json({
        status: true,
        message: "Publicacion encontrada",
        publicacion: post,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  updatePost = async (req, res) => {
    const { id } = req.params;
    try {
      const updatePost = await postModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      if (!updatePost) {
        res
          .status(404)
          .json({ status: false, message: "Publicacion no encontrada" });
      }
      res.status(200).json({
        status: true,
        message: "Publicacion actualizada con exito",
        publicacion: updatePost,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  deletePost = async (req, res) => {
    const { id } = req.params;
    try {
      const post = await postModel.findByIdAndDelete(id);
      if (!post) {
        res
          .status(404)
          .json({ status: false, message: "Publicacion no encontrada" });
      }
      res.status(200).json({
        status: true,
        message: "Publicacion eliminada con exito",
        publicacion: post,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  likePost = async (req, res) => {
    const { id } = req.params;
    try {
      const post = await postModel.findById(id);
      if (!post) {
        return res
          .status(404)
          .json({ status: false, message: "Publicación no encontrada" });
      }
      if (isNaN(post.likes)) {
        post.likes = 0;
      }
      post.likes += 1;
      await post.save();
      res.status(200).json({
        status: true,
        message: "Like incrementado con éxito",
        publicacion: post,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  addComment = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Usuario no autenticado." });
    }
    const userId = user._id;
    try {
      if (!comment) {
        return res
          .status(400)
          .json({ message: "El comentario no puede estar vacío." });
      }
      const post = await postModel.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Publicación no encontrada." });
      }
      post.review.push({
        user: userId,
        comment,
        date: new Date(),
      });
      await post.save();

      res.status(200).json({ message: "Comentario agregado con éxito.", post });
    } catch (err) {
      console.error("Error al agregar comentario:", err);
      res
        .status(500)
        .json({ message: "Error interno del servidor.", error: err.message });
    }
  };
}

module.exports = PostController;
