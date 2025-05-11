//const express = require('express')
import express from 'express'
import "dotenv/config"
import mongoose from "mongoose"
import cors from 'cors'
import authorRoutes from './routes/authors.route.js'
import blogPostRoutes from './routes/blogPost.route.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import passport from 'passport'
import googleStrategy from './middlewares/OAUthMiddleware.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(express.json())
app.use(cors({origin:'*'}))
app.use('/authors', authorRoutes)
app.use('/blogPosts', blogPostRoutes)
app.use('/auth', authRoutes)
passport.use('google', googleStrategy)


app.use(errorMiddleware.badRequestHandler)
app.use(errorMiddleware.notfoundHandler)
app.use(errorMiddleware.unauthorizedHandler)
app.use(errorMiddleware.errorHandler)





app.get('/', (req , res)=>{
    res.json({messagge: "App connect"})
})

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected")

        app.listen(process.env.PORT, ()=>{
            console.log('server is running on ' +  process.env.PORT)
        })
    } catch (error) {
        console.error("MongoDb connection error:", error)
        process.exit(1)
    }
}

connectDB()



