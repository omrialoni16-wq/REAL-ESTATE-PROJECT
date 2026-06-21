import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["Buyer", "Agency"],
    },
    agencyName: {
      type: String,
      required: function () {
        return this.role === "Agency";
      },
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: function () {
        return this.role === "Agency";
      },
      trim: true,
    },
    officeAddress: {
      type: String,
      required: function () {
        return this.role === "Agency";
      },
      trim: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model("users", userSchema);
export default User;
