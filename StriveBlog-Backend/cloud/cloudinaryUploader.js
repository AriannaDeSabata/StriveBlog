import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const storageCloud =  new CloudinaryStorage({
        cloudinary: cloudinary,
        params:{
            folder:"striveBlog", 
        }
    })

    /*const fileFilter = (req, file, cb)=>{
        if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
            cb(null, true)
        }else{
            cb(new Error("Solo immagini jpeg, png, jpg "), false)
        }
    }*/

    const cloudUploader = multer({
        storage: storageCloud,
       // fileFilter : fileFilter
    })

export default cloudUploader