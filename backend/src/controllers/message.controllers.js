import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import cloudinary from "cloudinary";
import { getReceiverSocketId, io } from "../lib/socketio.js";

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;  // Get the current user's ID from the request

        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserId }      // Find all users except the logged-in user
        }).select("-password");               // Exclude the password field from the result

        res.status(200).json(filteredUsers);  // Send the filtered user list
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);  // Log any error
        res.status(500).json({ error: "Internal server error" });       // Respond with 500
    }
};
export const getMessage= async (req, res) => {
    try {
        const { id: userToChatId } = req.params;  // Get the user ID to chat with from URL params
        const myId = req.user._id;               // Get current logged-in user ID

        const messages = await Message.find({
            $or: [                                // Find messages where:
                { senderId: myId, receiverId: userToChatId },      // you sent to them
                { senderId: userToChatId, receiverId: myId }       // or they sent to you
            ],
        });

        res.status(200).json(messages);          // Return the messages
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const sendMessage=async(req,res)=>{
try {
    const { text, image } = req.body;                         // Extract text and image from the request body
    const { id: receiverId } = req.params;                    // Extract receiverId from route parameters
    const senderId = req.user._id;                            // Get sender's user ID from authenticated request

    let imageUrl;                                             // Initialize imageUrl as undefined

    if (image) {
        // Upload base64 image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;                 // Get the secure URL from the Cloudinary response
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,                                      // Include image URL if available
    });
    await newMessage.save();
    //todo realtime functionality by sockit.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(202).json(newMessage);
}
    catch(error){
            console.log("error in sendMesage controller",error.message);
            res.status(404).json({message:"error in sendMessage controller"})
         
    }
};