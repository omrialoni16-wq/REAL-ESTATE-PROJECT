import mongoose from "mongoose";
import { propertiesConnection } from "../config/db.js";
import { userSchema } from "./User.js";

if (!propertiesConnection.models.users) {
  propertiesConnection.model("users", userSchema);
}

const propertySchema = new mongoose.Schema(
  {
    img: {
      type: String,
      trim: true,

      default:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    },
    price: { type: Number, required: true, min: 0 },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["Apartment", "Penthouse", "House", "Duplex", "Studio"],
    },
    rooms: { type: Number, required: true, min: 0 },
    floor: { type: Number, required: true, min: -1 },
    size: { type: Number, required: true, min: 0 },
    info1: { type: String, trim: true },
    tags: { type: [String], default: [] },
    listingType: {
      type: String,
      enum: ["standard", "premium"],
      default: "standard",
    },
    videoUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return !value || /^(https?:\/\/).+/i.test(value);
        },
        message: "Video URL must be a valid HTTP or HTTPS URL.",
      },
    },
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
  },
  { timestamps: true },
);

export default propertiesConnection.model("apartments", propertySchema);
