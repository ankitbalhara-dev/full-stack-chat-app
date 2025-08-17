// 1. Import the Cloudinary v2 API and name it `cloudinary`
import { v2 as cloudinary } from "cloudinary";

// 2. Import `config` function from dotenv to load environment variables
import { config } from "dotenv";

// 3. Run dotenv config to load .env variables into process.env
config();
// 4. Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,   // Your Cloudinary account's cloud name
  api_key: process.env.CLOUDINARY_API_KEY,         // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET,   // Your Cloudinary API secret
});
export default cloudinary;