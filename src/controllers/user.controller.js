const userModel = require("../models/user.model");
const DTO = require("../dto/userDto");
const EmailManager = require("../service/mailer.services.js");
const { generarResetToken } = require("../utils/tokenReset");
const { createHash, isValidPassword } = require("../utils/hashBcrypt");
const configObject = require("../config/env.config");

const mailer = new EmailManager();

class UserController {
  getAllUsers = async (req, res) => {
    try {
      const users = await userModel.find({}).select("-password");
      if (!users) {
        res
          .status(404)
          .json({ status: false, message: "Usuarios no encontrados" });
      }
      res.status(201).json({
        status: true,
        message: "Usuarios encontrados",
        usuarios: users,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "error interno del servidor",
        error: err.message,
      });
    }
  };

  getUserById = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userModel.findById(id).select("-password");
      if (!user) {
        res
          .status(404)
          .json({ status: false, message: "Usuario no encontrado" });
      }
      res
        .status(201)
        .json({ status: true, message: "Usuario encontrado", usuario: user });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "error interno del servidor",
        error: err.message,
      });
    }
  };

  updateUser = async (req, res) => {
    const { id } = req.params;
    try {
      const updateUser = await userModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      if (!updateUser) {
        res
          .status(404)
          .json({ status: false, message: "Usuario no encontrado" });
      }
      res.status(200).json({
        status: true,
        message: "Usuario actualizado con exito",
        usuario: updateUser,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "error interno del servidor",
        error: err.message,
      });
    }
  };

  deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const deleteUser = await userModel.findByIdAndDelete(id);
      if (!deleteUser) {
        res
          .status(404)
          .json({ status: false, message: "Usuario no encontrado" });
      }
      res.clearCookie(configObject.auth.cookie_token);
      res.status(200).json({
        status: true,
        message: "Usuario eliminado con exito",
        usuario: deleteUser,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "error interno del servidor",
        error: err.message,
      });
    }
  };

  RequestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.render("passwordChange", { error: "Usuario no encontrado" });
      }
      const token = generarResetToken();
      user.token_reset = {
        token: token,
        expire: new Date(Date.now() + 3600000),
      };
      await user.save();
      await mailer.enviarCorreoRestablecimiento(email, token);
      res.redirect("/success");
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "error interno del servidor",
        error: err.message,
      });
    }
  };

  resetPassword = async (req, res) => {
    const { email, password, token } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.render("resetPass", { error: "Usuario no encontrado" });
      }
      const resetToken = user.token_reset;
      if (!resetToken || resetToken.token !== token) {
        return res.render("resetPass", { error: "Token invalido" });
      }
      const ahora = new Date();
      if (ahora > resetToken.expire) {
        return res.render("resetPass", { error: "El token expiro" });
      }
      if (isValidPassword(password, user)) {
        return res.render("resetPass", {
          error: "La nueva contraseña no puede ser igual a a la anterior",
        });
      }
      user.password = createHash(password);
      user.token_reset = undefined;
      await user.save();
      return res.redirect("/login");
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "error interno del servidor",
        error: err.message,
      });
    }
  };
}

module.exports = UserController;
