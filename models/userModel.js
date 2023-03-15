const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  orderHistory:[{
    name: String,
    price: Number
  }
  ],
  currentOrder:[{
    name: String,
    price: Number
  }
  ],
}, {
  timestamps:true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
