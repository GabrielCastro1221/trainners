const nodemailer = require("nodemailer");
const { logger } = require("../middlewares/logger.middleware");
const configObject = require("../config/env.config");

class MailerController {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: configObject.mailer.email_service,
      auth: {
        user: configObject.mailer.mailer_user,
        pass: configObject.mailer.mailer_pass,
      },
    });
  }

  async enviarCorreoCompra(email, name, ticket) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: email,
        subject: "Nacci Trainner - Ticket de Compra",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #4CAF50;">Olympia Alternativa</h1>
            </div>
            <h2 style="color: #4CAF50;">¡Ticket de compra generado con éxito!</h2>
            <p>Buenas tardes:</p>
            <p>Nos complace informarte que el número de orden de tu compra es: <strong>#${ticket}</strong>.</p>
            <p>Una vez se apruebe el pago, nos dispondremos a enviar los artículos a la brevedad.</p>
            <h3 style="color: #4CAF50;">¡Esperamos que disfrutes tu pedido!</h3>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${configObject.server.base_url}/tienda" style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Visita nuestra tienda</a>
            </div>
          </div>
        `,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error("Error al enviar Email:", error);
    }
  }

  async enviarCorreoBienvenidaTrainer(email, name, password) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: email,
        subject: "¡Bienvenido a Nacci Trainner!",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #4CAF50;">Nacci Trainer</h1>
            </div>
            <h2>¡Bienvenido a nuestro equipo, ${name}!</h2>
            <p>Hola ${name},</p>
            <p>Estamos emocionados de que te unas a nuestra comunidad como entrenador.</p>
            <p>En Nacci Trainner, creemos en el poder de transformar vidas a través del entrenamiento y el bienestar. Esperamos que disfrutes de esta experiencia tanto como nosotros.</p>
            <p>Tu correo de acceso es: <strong>${email}</strong></p>
            <p>Tu contraseña de acceso es: <strong>${password}</strong></p>
            <h3>¡Estamos aquí para apoyarte en cada paso del camino!</h3>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${configObject.server.base_url}" style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Visita nuestro sitio</a>
            </div>
          </div>
        `,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error("Error al enviar Email de bienvenida:", error);
    }
  }

  async enviarCorreoCambioEstado(email, name, status) {
    try {
      const estadoTexto = status === "approved" ? "aprobado" : "cancelado";
      const Opt = {
        from: configObject.mailer.email_from,
        to: email,
        subject: `Nacci Trainer - Estado de Entrenador ${estadoTexto}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #4CAF50;">Nacci Trainner</h1>
            </div>
            <h2 style="color: #4CAF50;">Estado de Entrenador ${estadoTexto}</h2>
            <p>Hola ${name},</p>
            <p>Te informamos que el estado de tu cuenta como entrenador ha sido <strong>${estadoTexto}</strong>.</p>
            <h3 style="color: #4CAF50;">¡Gracias por ser parte de Nacci trainner!</h3>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${configObject.server.base_url}" style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Visita nuestro sitio</a>
            </div>
          </div>
        `,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error("Error al enviar Email de cambio de estado:", error);
    }
  }

  async enviarCorreoPagoAprobado(email, name, ticketId) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: email,
        subject: "Nacci Trainner - Pago Aprobado",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4CAF50;">Nacci Trainner</h1>
          </div>
          <h2 style="color: #4CAF50;">¡Tu pago ha sido aprobado!</h2>
          <p>Hola ${name},</p>
          <p>Nos complace informarte que tu pago ha sido aprobado.</p>
          <p>El número de tu ticket es: <strong>#${ticketId}</strong>.</p>
          <h3 style="color: #4CAF50;">¡Gracias por tu compra!</h3>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${configObject.server.base_url}/tienda" style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Visita nuestra tienda</a>
          </div>
        </div>
      `,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error("Error al enviar Email de pago aprobado:", error);
    }
  }

  async enviarCorreoRestablecimiento(email, token) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: email,
        subject: "Nacci Trainner - Recuperar contraseña",
        html: ` <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;"> <div style="text-align: center; margin-bottom: 20px;"> <h1 style="color: #4CAF50;">Nacci Trainner</h1> </div> <h2 style="color: #4CAF50;">Olvidaste tu contraseña?</h2> <p>Has olvidado tu contraseña? no te preocupes con el siguiente codigo de confirmacion podras actualizar tu contraseña</p> <p>codigo de confirmacion: <strong>#${token}</strong>.</p> <h3 style="color: #4CAF50;">¡Este token expira en una hora!</h3> <div style="text-align: center; margin-top: 20px;"> <a href="${configObject.server.base_url}/change-password" style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Recuperar contraseña</a> </div> </div> `,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error(
        "Error al enviar Email de restablecimiento de contraseña:",
        error
      );
    }
  }
}

module.exports = MailerController;
