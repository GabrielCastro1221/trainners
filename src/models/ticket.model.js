const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    amount: { type: Number, required: true },
    purchaser: {
      type: Schema.Types.ObjectId,
      ref: "Usuarios",
      required: true,
    },
    purchase_datetime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    isPaid: {
      type: String,
      enum: ["pago", "pendiente", "cancelado"],
      default: "pendiente",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Ticket", schema);
