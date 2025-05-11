import "dotenv/config"
import jwt from 'jsonwebtoken'
import authorModel from "../models/authorsModel.js"
import mongoose from "mongoose"


const jwtSecretKey = process.env.JWT_SECRET_KEY

const authMiddleware = async (req ,res , next)=>{

    try {
        const tokenBearer = req.headers.authorization 
        if(tokenBearer !== undefined){
            const token = tokenBearer.replace('Bearer ', '')
            const data = await verifyJWT(token)


            if(!mongoose.isValidObjectId(data.id)){
                return res.status(400).json({message: "invalid userID"})
            }

            if(data.exp){
                const userFound = await authorModel.findById(data.id)

                if(userFound){
                    req.user = userFound

                    return next()

                }else{
                   return res.status(401).send("User not found")
                }

            }else{
              return res.status(401).send("Please login again")
            }

        }else{
          return res.status(403).send('Token required!')
        }

    } catch (err){
        next('Token error' + err)
    }

}

const verifyJWT = (token)=>{
    return new Promise((res,rej)=>{
        jwt.verify(token, jwtSecretKey, (err, data)=>{
            if(err) rej(err)
                else res(data)
        })
    })
}


export default authMiddleware