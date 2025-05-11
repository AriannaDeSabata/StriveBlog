import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import "dotenv/config"
import authorModel from '../models/authorsModel.js'
import generateTokenJWT from '../service/token.js'


const googleStrategy = new GoogleStrategy({

    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback"

  },async function(accessToken, refreshToken, profile, passportNext){

    try {
      //destrutturo le info di google
        const {email, given_name, family_name, picture} = profile._json

        //verifico se presente l'utente nel db
        const user = await authorModel.findOne({email})

        //se presente utitlizzo i dati per creare il token 
        if(user){
            const accessToken = await generateTokenJWT({
              id: user.id,
              name : user.name,
              surname: user.surname,
              email: user.email

            })

          passportNext(null, {accessToken})

        }else{
          
          //se non è presente nel db lo salvo e genero il token 
          const newUser = new authorModel({
            name: given_name,
            surname: family_name,
            email: email,
            date: '',
            avatar: picture,
            password:'-'

          })

          const userSave = await newUser.save()

          //genero il token
          const accessToken = await generateTokenJWT({
            id: userSave.id,
            name : userSave.name,
            surname: userSave.surname,
            email: userSave.email

          })
          passportNext(null, {accessToken})

        }


    } catch (error) {
        passportNext(error)
    }
  }
  
)

export default googleStrategy