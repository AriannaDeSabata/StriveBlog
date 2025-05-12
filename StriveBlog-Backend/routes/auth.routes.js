import express from 'express'
import passport from 'passport'

const route = express.Router()


route.get('/googleLogin', passport.authenticate('google', {scope: ['profile', 'email'],  prompt: 'select_account'}))

route.get('/google/callback', passport.authenticate('google', {session: false,failureRedirect:'/login'}), async(req , res , next)=>{
    try {
        res.redirect('https://strive-blog-two.vercel.app/home')
    } catch (err) {
        next(err)
    }
})

export default route