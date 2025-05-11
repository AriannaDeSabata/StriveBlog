import mongoose from "mongoose"


const blogPostSchema = new mongoose.Schema({
    category: {
        type: String
    },
    title: {
        type: String
    },
    cover: {
        type: String
    },
    readTime:{
        value: {
            type: Number
        },
        unit :{
            type: String
        }
    },
    author : {
        type: mongoose.Schema.ObjectId,
        ref : 'Authors',
        required: true
    },
    content: {
        type: String
    },
    comments :[
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId, 
                default: () => new mongoose.Types.ObjectId() // ID univoco per ogni commento
            },
            text:{
                type: String,
                required: true
            },
            author: {
                type: mongoose.Schema.ObjectId,
                ref : 'Authors'
            }
    
        }
    ]
})

const blogPostModel = mongoose.model('BlogPost', blogPostSchema)

export default blogPostModel