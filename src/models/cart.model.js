const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Productos",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.pre("findOne", function (next) {
  this.populate("products.product", "_id title price");
  next();
});

module.exports = model("carts", schema);
