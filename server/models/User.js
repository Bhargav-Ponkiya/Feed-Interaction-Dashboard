const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// const UserSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please provide name"],
//     },
//     email: {
//       type: String,
//       unique: true,
//       required: [true, "Please provide email"],
//       validate: {
//         validator: validator.isEmail,
//         message: "Please provide valid email",
//       },
//     },
//     password: {
//       type: String,
//       required: [true, "Please provide password"],
//     },
//     role: {
//       type: String,
//       enum: ["admin", "user"],
//       default: "user",
//     },
//     credits: {
//       type: Number,
//       default: 0,
//     },
//     bio: {
//       type: String,
//       default: "",
//       maxlength: 500,
//     },
//   },
//   { timestamps: true }
// );

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please provide name"] },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    password: { type: String, required: [true, "Please provide password"] },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    credits: { type: Number, default: 0 },
    bio: { type: String, default: "", maxlength: 500 },
    socialLinks: { type: String, default: "" }, // ✅ ADD THIS,
    lastLogin: {
      type: Date,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
