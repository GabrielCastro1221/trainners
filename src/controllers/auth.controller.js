const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const cartModel = require("../models/cart.model");
const trainerModel = require("../models/trainer.model");
const configObject = require("../config/env.config");
const { createHash, isValidPassword } = require("../utils/hashBcrypt");
const DTO = require("../dto/userDto");
const trainerDTO = require("../dto/trainerDto");

class AuthController {
  async register(req, res) {
    const {
      email,
      password,
      name,
      phone,
      gender,
      role,
      educations,
      experiences,
      services,
      bio,
      about,
      specialization,
    } = req.body;
    const photo = req.file ? req.file.path : null;
    try {
      const userExist = await userModel.findOne({ email });
      const trainerExist = await trainerModel.findOne({ email });

      if (userExist || trainerExist) {
        return res.status(400).json({
          status: false,
          message: "El correo ya está registrado",
        });
      }
      const parseArrayField = (field) => {
        if (!field) return [];
        try {
          return Array.isArray(field) ? field : JSON.parse(field);
        } catch {
          return [];
        }
      };
      const educationsParsed = parseArrayField(educations);
      const experiencesParsed = parseArrayField(experiences);
      const servicesParsed = parseArrayField(services);
      const newCart = new cartModel();
      await newCart.save();
      if (role === "entrenador") {
        const newTrainer = new trainerModel({
          email,
          password: createHash(password),
          name,
          phone,
          photo,
          role,
          educations: educationsParsed,
          experiences: experiencesParsed,
          services: servicesParsed,
          bio,
          about,
          specialization,
          gender,
        });
        await newTrainer.save();
        return res.status(201).json({
          status: true,
          message: "Entrenador registrado con éxito",
          entrenador: newTrainer,
        });
      } else {
        const newUser = new userModel({
          name,
          email,
          password: createHash(password),
          phone,
          photo,
          gender,
          role: "usuario",
          cart: newCart._id,
        });
        await newUser.save();
        return res.status(201).json({
          status: true,
          message: "Usuario registrado con éxito",
          usuario: newUser,
        });
      }
    } catch (error) {
      console.error("Error detallado:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      let user = null;
      const userFound = await userModel.findOne({ email });
      const trainerFound = await trainerModel.findOne({ email });
      if (userFound) {
        user = userFound;
      } else if (trainerFound) {
        user = trainerFound;
      }
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "El email no está asociado a ninguna cuenta",
        });
      }
      const isValid = isValidPassword(password, user);
      if (!isValid) {
        return res
          .status(404)
          .json({ status: false, message: "Contraseña incorrecta" });
      }
      const token = jwt.sign({ user: user }, configObject.auth.jwt_secret, {
        expiresIn: "15d",
      });
      res.cookie(configObject.auth.cookie_token, token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      await user.save();
      res.status(201).json({
        status: true,
        message: "Inicio de sesión exitoso",
        token: token,
        usuario: user,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  }

  async getUserProfile(req, res) {
    try {
      const dto = new DTO(req.user.name, req.user.email, req.user.role);
      const isUser = req.user.role === "usuario";
      res.status(201).json({ status: true, user: dto, role: isUser });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  }

  async getTrainerProfile(req, res) {
    try {
      const trainer = req.user;
      if (!trainer || trainer.role !== "entrenador") {
        return res.status(404).json({
          status: false,
          message: "Perfil de entrenador no encontrado o rol inválido.",
        });
      }
      const dto = new trainerDTO(trainer);
      const isTrainer = trainer.role === "entrenador";
      res.status(200).json({
        status: true,
        user: dto,
        role: isTrainer,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie(configObject.auth.cookie_token);
      res
        .status(201)
        .json({ status: true, message: "Sesión destruida con éxito" });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  }
}

module.exports = AuthController;
