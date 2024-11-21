const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // createdAt: { type: Date, default: Date.now },
  // updatedAt: { type: Date, default: Date.now },
});

// // Middleware to hash password before saving
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     console.log("Hashing password for user:", this.username);
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   this.updatedAt = Date.now(); // Update timestamp on any update
//   next();
// });

module.exports = mongoose.model("User", userSchema);


