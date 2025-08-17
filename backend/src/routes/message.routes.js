import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import {getUsersForSideBar ,getMessage,sendMessage} from "../controllers/message.controllers.js"
const router=express.Router();
router.get("/users",protectRoute, getUsersForSideBar);
router.get("/:id",protectRoute,getMessage);
router.post("/send/:id",protectRoute,sendMessage)
export default router;