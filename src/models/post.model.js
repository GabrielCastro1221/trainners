const { Schema, model } = require("mongoose");

const schema = new Schema({
  img: { type: String, required: true },
  category: { type: String, required: true },
  post_date: { type: String, default: Date.now },
  title_one: { type: String, required: true },
  desc_one: { type: String, required: true },
  title_two: { type: String },
  desc_two: { type: String },
  likes: { type: Number, default: 0 },
  review: [
    {
      user: { type: Schema.Types.ObjectId, ref: "Usuario" },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now }
    },
  ],
});

module.exports = model("Posts", schema);
