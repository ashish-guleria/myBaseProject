const mongoose = require("mongoose");
const { linkType } = require("../config/appConstants");

const linkSchema = mongoose.Schema(
  {
    handle: { type: String, require: true },
    linkType: {
      type: String,
      enum: [...Object.values(linkType)],
      require: true,
    },
    name: { type: String, trim: true, require: true },
    userId: { type: mongoose.Schema.ObjectId, ref: "users", required: true },
    thumbnail: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Link = mongoose.model("links", linkSchema);

module.exports = Link;
