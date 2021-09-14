const mongoose = require("mongoose");
const { tokenTypes, status } = require("../config/appConstants");

const connectionSchema = mongoose.Schema(
  {
    connectionId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    requestStatus: {
      type: String,
      enum: [...Object.values(status)],
      default: status.PENDING,
    },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Connection = mongoose.model("connections", connectionSchema);

module.exports = Connection;
