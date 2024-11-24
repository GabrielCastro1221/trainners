const trainerModel = require("../models/trainer.model");
const cartModel = require("../models/cart.model");
const { createHash } = require("../utils/hashBcrypt");
const MailerController = require("../service/mailer.services");

const mailer = new MailerController();

class TrainerController {
  createTrainer = async (req, res) => {
    const { name, email, password, photo } = req.body;
    try {
      if (!name || !email || !password) {
        return res.status(400).json({
          status: false,
          message:
            "Por favor diligencia todos los campos para continuar con el registro",
        });
      }
      const newCart = new cartModel();
      await newCart.save();
      const newTrainer = new trainerModel({
        name,
        email,
        password: createHash(password),
        cart: newCart._id,
        photo,
      });
      await newTrainer.save();
      await mailer.enviarCorreoBienvenidaTrainer(email, name, password);
      res.status(200).json({
        status: true,
        message: "Entrenador creado con éxito",
        entrenador: newTrainer,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  getAllTrainers = async (req, res) => {
    try {
      const trainers = await trainerModel.find({}).select("-password");
      if (!trainers) {
        res
          .status(404)
          .json({ status: false, message: "Entrenadores no encontrados" });
      }
      res.status(201).json({
        status: true,
        message: "Entrenadores encontrados",
        entrenadores: trainers,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  getTrainerById = async (req, res) => {
    const { id } = req.params;
    try {
      const trainer = await trainerModel.findById(id).select("-password");
      if (!trainer) {
        res
          .status(404)
          .json({ status: false, message: "Entrenadores no encontrados" });
      }
      res.status(201).json({
        status: true,
        message: "Entrenador encontrado",
        entrenador: trainer,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  updateTrainer = async (req, res) => {
    const { id } = req.params;
    try {
      const updateTrainer = await trainerModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      if (!updateTrainer) {
        res
          .status(404)
          .json({ status: false, message: "Entrenadores no encontrados" });
      }
      res.status(200).json({
        status: true,
        message: "Entrenador actualizado con exito",
        entrenador: updateTrainer,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  deleteTrainer = async (req, res) => {
    const { id } = req.params;
    try {
      const deleteTrainer = await trainerModel.findByIdAndDelete(id);
      if (!deleteTrainer) {
        res
          .status(404)
          .json({ status: false, message: "Entrenadores no encontrados" });
      }
      res.status(200).json({
        status: true,
        message: "Entrenador eliminado con exito",
        entrenador: deleteTrainer,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: err.message,
      });
    }
  };

  changeStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !["pending", "approved", "cancelled"].includes(status)) {
      return res.status(400).json({
        status: false,
        message:
          "Estado no válido. Debe ser 'pending', 'approved' o 'cancelled'.",
      });
    }
    try {
      const trainer = await trainerModel.findById(id);
      if (!trainer) {
        return res.status(404).json({
          status: false,
          message: "Entrenador no encontrado.",
        });
      }
      trainer.isApproved = status;
      await trainer.save();
      if (status === "approved" || status === "cancelled") {
        await mailer.enviarCorreoCambioEstado(
          trainer.email,
          trainer.name,
          status
        );
      }
      return res.status(200).json({
        status: true,
        message: "Estado del entrenador actualizado.",
        trainer,
      });
    } catch (error) {
      console.error("Error al cambiar el estado del entrenador:", error);
      return res.status(500).json({
        status: false,
        message: "Hubo un problema al cambiar el estado del entrenador.",
      });
    }
  };
}

module.exports = TrainerController;
