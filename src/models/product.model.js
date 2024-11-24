const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["pendiente", "aprovado", "cancelado"],
      default: "pendiente",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.plugin(mongoosePaginate);

module.exports = model("Productos", schema);
