import jwt from "jsonwebtoken";
import User from "../models/user.models.js"

export const protectRoute=async (req,res,next)=>{

 // Middleware to protect routes by verifying JWT and attaching user to request
try {
    // 1. Get the token from cookies
    const token = req.cookies.jwt;

    // 2. If token not found, return unauthorized
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // 3. Verify the token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. If token verification fails, return unauthorized
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // 5. Find the user by ID from decoded token, exclude password
    const user = await User.findById(decoded.userId).select("-password");

    // 6. If user not found in DB, return 404
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // 7. Attach user to the request object for use in protected routes
    req.user = user;

    // 8. Call the next middleware/controller
    next();
} catch (error) {
    // 9. Catch and return any server error
    res.status(500).json({ message: "Internal Server Error" });
}

};
