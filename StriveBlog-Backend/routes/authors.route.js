import express from 'express'
import authorModel from '../models/authorsModel.js'
import blogPostModel from '../models/blogPostModel.js'
import cloudUploader from '../cloud/cloudinaryUploader.js'
import bcrypt from 'bcrypt'
import "dotenv/config"
import generateTokenJWT from '../service/token.js'

import authMiddleware from '../middlewares/authMiddleware.js'


const route = express.Router()

const saltRound = +process.env.SALT_ROUND

route.post('/login', async (req, res, next)=>{
    //logica per il login
    const authorEmail = req.body.email
    const password = req.body.password

    //cerco l'author tramite email
    const authorLogin = await authorModel.findOne({email: authorEmail})

    //controllo se è stato trovato 
    if(authorLogin){
        //controllo se la password corrisponde 
        const log = await bcrypt.compare(password, authorLogin.password)

        if(log){
            //genero token JWT
            const token = await generateTokenJWT({
                id: authorLogin.id,
                name : authorLogin.name,
                surname: authorLogin.surname,
                email: authorLogin.email
            })

            res.status(200).json(token)
        }else{
            res.status(400).json({message: "password erratta"}) 
        }
    }else{
        res.status(400).json({message: "email non valida"}) 
    }

})

//endpoint per recuperare l'user dal token 
route.get('/me', authMiddleware, async (req, res, next) => {
    try {
        //recupero i dati che voglio passare da req.author
        const { id, name, surname, email, avatar, date } = req.user
        
        res.status(200).json({ id, name, surname, email, avatar, date })

    } catch (err) {
        next(err);
    }
})




//endPoint per leggere tutti i dati
route.get('/', authMiddleware , async (req , res, next)=>{
    try{
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const author = await authorModel.find().limit(limit).skip(limit * (page-1))
        res.status(200).json(author)

    }catch (err){
        next(err)
    }

})



//endPoint per leggere i dati di un singolo user tramite il recupero di un parametro
route.get('/:id', authMiddleware ,async (req, res, next)=>{
    const id = req.params.id
    try{
        const author = await authorModel.findById(id)
        res.status(200).json(author)

    } catch (err){
       next(err)
    }

})


//enPoint per salvare i dati nel db
route.post('/register', async (req, res, next)=>{

    //recupero password
    const password = req.body.password

    //creo un nuovo author cryptando la psw
    const newAuthor = new authorModel({
        ...req.body,
        password : await bcrypt.hash(password, saltRound)
    })

    //salvo l'author
    const authorSave = await newAuthor.save()
     
    res.status(201).json(authorSave)
})


//endPoint per modificare un'oggetto
route.put('/:id', authMiddleware , async (req, res, next)=>{
    const id = req.params.id
    const obj = req.body
    try{
        const authorUpdate = await authorModel.findByIdAndUpdate(id,obj, {new: true})
        res.json(authorUpdate)

    }catch (err){
        next(err)
    }
})

//endPoind per eliminare un'oggetto 
route.delete('/:id', authMiddleware , async(req, res, next)=>{
    const id = req.params.id
    try{
        await authorModel.findByIdAndDelete(id)
        res.status(200).json({message : "delete success"})
        
    }catch (err){
        next(err)
    }
})

route.get('/:id/blogPosts', authMiddleware , async(req ,res, next)=>{
    const idAuthor = req.params.id

    try {
        const page = parseInt(req.query.page) ||1
        const limit = parseInt(req.query.limit) || 10

        const author = await authorModel.findById(idAuthor)

    
        if(!author){
            return res.status(400).json({error : "Author not Found"})
        }
        const authorId = author.id
        const  posts = await blogPostModel.find({author : authorId }).limit(limit).skip(limit * (page -1))
        res.status(200).json(posts)
        
    } catch (err) {
        next(err)
    }
})


route.patch("/:authorId/avatar", authMiddleware ,cloudUploader.single("avatar"), async(req, res,next)=>{

    try{
        const authorId = req.params.authorId
        const updateAuthor = await authorModel.findByIdAndUpdate(
            authorId,
            {avatar: req.file.path},
            {new: true}

        )

        if(!updateAuthor){
            res.status(404).json({message: "utente non trovato"})
        }

        res.json({updateAuthor})

    }catch(err){
        next(err)
    }
})





  



export default route