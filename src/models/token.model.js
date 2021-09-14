const mongoose = require("mongoose");
const { tokenTypes } = require("../config/appConstants");

const tokenSchema = mongoose.Schema(
  {
    token: { type: String, required: true, index: true },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "users", required: true },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.ACCESS, tokenTypes.RESET_PASSWORD],
      required: true,
    },
    expires: { type: Date, required: true },
    blacklisted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Token
 */
const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
