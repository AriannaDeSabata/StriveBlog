import mongoose from "mongoose";


//struttura dei dati da memorizzare
const authorSchema = new mongoose.Schema({
    name: {
        type: String , 
        required: true
    },
    surname: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true, 
        unique: true
    },
    date: {
        type: Date, 

    },
    avatar : {
        type: String, 
    },
    password :{
        type: String,
        required: true
    }

})

//creazione collection di nome Authors + struttura
const authorModel = mongoose.model('Authors', authorSchema)

export default authorModel