const mongoose = require("mongoose");
const MessageSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    socketId:{type:String}
    },
  {
    timestamps: true,
  }
);
const MessageModel = mongoose.model("Messages", MessageSchema);
module.exports = MessageModel;
