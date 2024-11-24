const ticketModel = require("../models/ticket.model");

class TicketController {
  getAllTicket = async (req, res) => {
    try {
      const tickets = await ticketModel
        .find({})
        .populate("purchaser", "name email");
      if (!tickets) {
        return res
          .status(404)
          .json({ status: false, message: "Tickets no encontrados" });
      }
      res.status(201).json({
        status: true,
        message: "Tickets encontrados",
        tickets: tickets,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al obtener los tickets",
        error: err.message,
      });
    }
  };

  getTicketById = async (req, res) => {
    const { id } = req.params;
    try {
      const ticket = await ticketModel.findById(id);
      if (!ticket) {
        res
          .status(404)
          .json({ status: false, message: "Ticket no encontrado" });
      }
      res
        .status(201)
        .json({ status: true, message: "Ticket encontrado", ticket: ticket });
    } catch (err) {
      res
        .status(500)
        .json({ status: false, message: "Error al obtener ticket" });
    }
  };

  deleteTicket = async (req, res) => {
    const { id } = req.params;
    try {
      const ticket = await ticketModel.findByIdAndDelete(id);
      if (!ticket) {
        res
          .status(404)
          .json({ status: false, message: "Ticket no encontrado" });
      }
      res.status(201).json({
        status: true,
        message: "Ticket eliminado con exito",
        ticket: ticket,
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: false, message: "Error al eliminar ticket" });
    }
  };

  updatePaymentStatus = async (req, res) => {
    const { id } = req.params;
    const { isPaid } = req.body;
    if (!["pago", "pendiente", "cancelado"].includes(isPaid)) {
      return res.status(400).json({
        status: false,
        message:
          "Estado de pago inválido. Debe ser 'pago', 'pendiente' o 'cancelado'.",
      });
    }
    try {
      const ticket = await ticketModel.findByIdAndUpdate(
        id,
        { isPaid },
        { new: true }
      );
      if (!ticket) {
        return res.status(404).json({
          status: false,
          message: "Ticket no encontrado",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Estado de pago actualizado con éxito",
        ticket: ticket,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Error al actualizar el estado de pago",
        error: err.message,
      });
    }
  };
}

module.exports = TicketController;
