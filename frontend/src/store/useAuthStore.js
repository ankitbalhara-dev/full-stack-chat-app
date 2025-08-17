import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
import {io} from "socket.io-client";
const BASE_URL=import.meta.env.MODE==="develoment"?"http://localhost:5001":"/";
export const useAuthStore = create((set,get) => ({
  authUser: null,            // Stores the logged-in user
  isSigningUp: false,        // Flag when user is signing up
  isLoggingIn: false,        // Flag when user is logging in
  isUpdatingProfile: false,  // Flag for profile update status
  isCheckingAuth: true  ,
  onlineUsers:[],
  socket:null,
    // Method to check if user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      // Store user data if authenticated
      set({ authUser: res.data });
      get().connectSocket()
    } catch (error) {
      console.log("Error in checkAuth:", error);
      // If not authenticated, clear the user
      set({ authUser: null });
    }
     finally {
      // Mark checking complete
      set({ isCheckingAuth: false });
    }     // Flag to indicate auth check is in progress
},
signup: async (data) => {
  set({ isSigningUp: true });

  try {
    const res = await axiosInstance.post("/auth/signup", data);

    // ✅ FIX HERE: use the full res.data as the authUser
    set({
      authUser: {
        _id: res.data._id,
        fullName: res.data.fullName,
        email: res.data.email,
        profilePic: res.data.profilePic,
      },
    });

    toast.success("Account created successfully");
    get().connectSocket()
  } catch (error) {
    console.error("Signup error:", error);
    toast.error(error.response?.data?.message || "Something went wrong!");
  } finally {
    set({ isSigningUp: false });
  }
},
login: async (data) => {
    set({ isLoggingIng: true });
    try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully");
        get().connectSocket()
    } catch (error) {
        toast.error(error.response.data.message);
    } finally {
        set({ isLoggingIng: false });
    }
}
,
logout: async () => {
  try {
    await axiosInstance.post("/auth/logout");
    set({ authUser: null });
    toast.success("Logged out successfully");
    get().disconnectSocket()
  } catch (error) {
    toast.error(error.response.data.message);
  }
},
updateProfile: async (data) => {
  set({ isUpdatingProfile: true });
  try {
    const res = await axiosInstance.put("/auth/update-profile", data);
    set({ authUser: res.data });
    toast.success("Profile updated successfully");
  } catch (error) {
    console.log("Error in updateProfile:", error);
    toast.error(error.response?.data?.message || "Profile update failed");
  } finally {
    set({ isUpdatingProfile: false });
  }
},
connectSocket:()=>{
  const {authUser}=get()
  if(!authUser || get().socket?.connected) return;

  const socket = io(BASE_URL, {
  query: { userId: authUser._id },
});

  socket.connect()
  set({socket:socket})
  socket.on("getOnlineUsers", (userIds) => {
  set({ onlineUsers: userIds });
  });

},
disconnectSocket:()=>{
  if(get().socket?.connected)
    get().socket.disconnect();
    
}
}));
