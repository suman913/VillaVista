const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require("multer");
const path = require("path");

const isCloudinaryConfigured =
  process.env.CLOUD_NAME &&
  process.env.CLOUD_API_KEY &&
  (process.env.CLOUD_API_SECRET || process.env.CLOUD_API_SECRTE);


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET || process.env.CLOUD_API_SECRTE,


});

const storage = isCloudinaryConfigured ? new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowed_formats:["png","jpg","jpeg"], // supports promises as well
     
    },
  }) : multer.diskStorage({
    destination: path.join(__dirname, "public", "uploads"),
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
      cb(null, uniqueName);
    },
  });


  module.exports ={
    cloudinary,
    storage,
  };
  
