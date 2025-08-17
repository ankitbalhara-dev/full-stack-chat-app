import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the sender (User)
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the receiver (User)
      ref: "User",
      required: true,
    },
    text: {
      type: String, // Optional message text
    },
    image: {
      type: String, // Optional image URL (e.g., from Cloudinary)
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);
const Message=mongoose.model("Message",messageSchema);
export default Message;