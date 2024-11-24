const { Router } = require("express");
const TicketController = require("../controllers/ticket.controller");

const router = Router();
const ticket = new TicketController();

router.get("/", ticket.getAllTicket);
router.get("/:id", ticket.getTicketById);
router.delete("/:id", ticket.deleteTicket);
router.put("/:id/status", ticket.updatePaymentStatus);

module.exports = router;
