import express from 'express'
import blogPostModel from '../models/blogPostModel.js'
import cloudUploader from '../cloud/cloudinaryUploader.js'
import mongoose from 'mongoose' 
import authMiddleware from '../middlewares/authMiddleware.js'


const route = express.Router()
 
//BlogPosts GET recupero dei blogPost tramite query, se assente recupera tutti i blogPost

route.get('/', authMiddleware ,async (req, res ,next)=>{
    try {
        const querySearch = req.query.q 
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 15
        const populationOption = [
            {
                path: 'author',
                select: ['name', 'surname', 'avatar'], // Popola i dati dell'autore del blog post
            },
            {
                path: 'comments',
                populate: {
                  path: 'author',
                  select: ['name', 'surname', 'avatar'], // Popola autore dei commenti (opzionale)
                }
            }
        ]

        let filterPosts 

        if(querySearch){
            filterPosts = await blogPostModel.find({
                title: { $regex: querySearch, $options: 'i' }
            })
            .limit(limit)
            .skip(limit * (page -1))
            .populate(populationOption)

            res.status(200).json(filterPosts)
            
        }else{
            
            const blogPosts = await blogPostModel.find()
            .limit(limit)
            .skip(limit * (page -1))
            .populate(populationOption)

            res.status(200).json(blogPosts)
            
        }

    } catch (err) {
        next(err)
    }

})


//BlogPostID GET recupero di un blogPost specifico 
route.get('/:id', authMiddleware , async (req ,res ,next)=>{
    const id = req.params.id
    try {
        const blogPost = await blogPostModel.findById(id)
        res.status(200).json(blogPost)
    } catch (err) {
        next(err)
    }
})


//Comments GET  recupero di tutti i commenti dal blogPost specifico 
route.get('/:id/comments', authMiddleware , async (req ,res ,next)=>{
    try {
        const blogPostId = req.params.id
        const blogPost = await blogPostModel.findById(blogPostId).populate({
            path: 'author',
            select: ['name', 'surname', 'avatar']
        })
        res.status(200).json(blogPost.comments)
        
    } catch (err) {
        next(err)
    }
})


//Comment ID GET recupero di un commento specifico da un blogPost specifico
route.get('/:id/comments/:commentId', authMiddleware , async (req ,res ,next)=>{
    try {
        const blogPostId = req.params.id
        const commentId = req.params.commentId
        const comments = await blogPostModel.findById(blogPostId)

        const comment = await comments.findById(commentId).populate({
            path: 'author',
            select: ['name', 'surname', 'avatar']
        })
        res.status(200).json(comment)

    } catch (err) {
        next(err)
    }
})

//BlogPost POST
route.post('/', authMiddleware , async(req ,res ,next)=>{


    try {
        console.log(req.user)
        const obj ={
            ...req.body,
            author: req.user.id
        }
        const newPost = new blogPostModel(obj)

        const dbPost = await newPost.save()
    
        res.status(201).json(dbPost)
    } catch (err) {
        next(err)
    }

})

//Comment Post aggiunta commento nel blogPost specifico
route.post('/:id', authMiddleware , async(req ,res ,next)=>{
    try {
        const comment = req.body
        const newComment = {
            _id: new mongoose.Types.ObjectId(),
            text: comment.text,
            author: req.user.id
        };
        const blogPost = await blogPostModel.findByIdAndUpdate(req.params.id,
            {
                $push: {
                  comments: newComment,
                },
              },
              { new: true }
        ).populate({
            path: "comments",
            populate:{
                path: "author",
                select: ["name", "surname"]
            }
        })

        res.status(201).json(blogPost)
    } catch (err) {
        next(err)
    }

})

//BlogPostID PUT 
route.put('/:id', authMiddleware , async (req ,res ,next)=>{
    const id = req.params.id
    const obj = req.body

    try {
        const postUpdate = await blogPostModel.findByIdAndUpdate(id,obj, {new: true})

        res.json(postUpdate)

    } catch (err) {
        next(err)
    }
})


//Comment ID PUT
route.put('/:id/comment/:commentId', authMiddleware , async (req ,res ,next)=>{
    const idBlogPost = req.params.id
    const updateData = req.body
    const commentId = req.params.commentId

    try {
        const blogPost = await blogPostModel.findOneAndUpdate(
            { _id: idBlogPost, "comments._id": commentId },
            {
                $set: {
                    "comments.$.text" : updateData.text,
                    "comments.$.author" : updateData.author
                }
            },
            { new: true }
        )

        if(!blogPost){
             res.status(404).json({message: "Post Not found"})
        }

        await blogPost.save()

        res.status(200).json(blogPost)

    } catch (err) {
        next(err)
    }
})

//Comment ID DELETE
route.delete('/:id/comment/:commentId', authMiddleware , async (req ,res ,next)=>{
    const idBlogPost = req.params.id
    const commentId = req.params.commentId

    try {
        const blogPost = await blogPostModel.findOneAndUpdate(
            { _id: idBlogPost},         //trova il post tramite ID
            {$pull: 
                {
                    comments :{_id: commentId}         //trova il commento tramite ID e rimuovilo
                }
            },      
            { new: true }
        )

        if(!blogPost){
            return res.json({error:"Post non trovato "})
        }


        res.status(200).json({message:"commento eliminato", blogPost})

    } catch (err) {
        next(err)
    }
})


//BlogPostID DELETE
route.delete('/:id', authMiddleware , async(req ,res ,next)=>{
    const id = req.params.id
    try{
        await blogPostModel.findByIdAndDelete(id)
        res.status(200).json({message:"delete success"})
    }catch(err){
        next(err)
    }
})


//BlogPostId PATCH Cover
route.patch('/:blogPostId/cover', authMiddleware , cloudUploader.single("cover"), async(req ,res, next)=>{
    try {
        const blogPostId = req.params.blogPostId
        const updateBlogPost = await blogPostModel.findByIdAndUpdate(
            blogPostId,
            {cover: req.file.path},
            {new: true}
        )
        if(!updateBlogPost){
            res.status(404).json({message: "blogPost non trovato"})
        }

        res.json(updateBlogPost)

    } catch (err) {
        next(err)
    }
})

export default route