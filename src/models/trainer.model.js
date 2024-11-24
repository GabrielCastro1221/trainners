const { Schema, model } = require("mongoose");

const trainerSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String },
  role: {
    type: String,
    enum: ["entrenador", "admin"],
    default: "entrenador",
  },
  educations: { type: Array },
  experiences: { type: Array },
  services: { type: Array },
  bio: { type: String, maxLength: 500 },
  about: { type: String },
  specialization: { type: String },
  isApproved: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
  gender: {
    type: String,
    enum: ["masculino", "femenino", "otro"],
  },
  token_reset: { token: String, expire: Date },
});

module.exports = model("Trainer", trainerSchema);
