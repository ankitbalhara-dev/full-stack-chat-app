import User from "../models/user.models.js"
import bcrypt from "bcryptjs"
import {generateToken} from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"
// Signup Controller
export const signup = async (req, res) => {
    // Extract fullName, email, and password from request body
    const { fullName, email, password } = req.body;

    try {
        // Check if any required field is missing
        if (!fullName || !email || !password) {
            return res.status(404).json({
                message: "All fields are required!!!"
            });
        }

        // Check if password is at least 6 characters long
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be more than 5 characters"
            });
        }

        // Check if a user with the given email already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Generate a salt for hashing the password
        const salt = await bcrypt.genSalt(10);

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance with hashed password
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        // If user object is valid, generate token, save user and send success response
        if (newUser) {
            // Generate JWT token and store it in a cookie
            generateToken(newUser._id, res);

            // Save the user to the database
            await newUser.save();

            // Send a success response with the user's details
            res.status(201).json({
                message: "User created successfully!",
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            // If user creation fails for some reason
            res.status(400).json({
                message: "Invalid user data"
            });
        }
    } catch (error) {
        // Catch any unexpected errors and respond with status 500
        console.log("Enter in signup controller,", error.message);
        res.status(500).json({
            message: "Internal server problem"
        });
    }
};

// Login Controller
export const login = async (req, res) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    try {
        // Find a user in the database with the provided email
        const user = await User.findOne({ email });

        // If no user is found, return an error response
        if (!user) {
            return res.status(404).json({
                message: "Invalid credentials" // Email doesn't exist
            });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        // If passwords don't match, return an error response
        if (!isPasswordCorrect) {
            return res.status(404).json({
                message: "Invalid credentials" // Wrong password
            });
        }

        // If authentication is successful, generate a JWT token and set it in a cookie
        generateToken(user._id, res);

        // Send a success response with user details
        res.status(202).json({
            _id: user._id,            // Corrected: should use `user`, not `newUser`
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        // Log and handle unexpected server errors
        console.log("Enter in login controller,", error.message);
        res.status(500).json({
            message: "Internal server problem"
        });
    }
};

export const logout = (req, res) => {
    try {
        // Clear the JWT cookie by setting its value to an empty string and expiring it immediately
        res.cookie("jwt", "", { maxAge: 0 });

        // Send a success response
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        // Log any unexpected error
        console.log("Error in logout controller:", error.message);

        // Send an internal server error response
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;             // Get the image (probably as a Base64 string or URL)
        const userId = req.user._id;                 // Get the user's ID from the auth middleware

        if (!profilePic) {
            return res.status(400).json({
                message: "Profile pic is required"   // If no profilePic provided, return error
            });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic); // Upload image to Cloudinary

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url }, // Save the uploaded image's secure URL to DB
            { new: true } // Return the updated user instead of the old one
        );

        res.status(200).json(updatedUser); // Send updated user back in response
    } catch (error) {
        console.log("error in update profile:", error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error" }); // Send generic server error
    }
};

export const checkAuth=(req,res)=>{
    try {
        res.status(202).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controller",error.message);
        res.status(404).json({
            message:"error in server"
        })
    }
};