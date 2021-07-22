const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    detail:{
        type:String,
        required:true,
        unique:false
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        unique:false
    },
    likes:{
        type:[mongoose.SchemaTypes.ObjectId],
        required:true,
        unique:false,
        defualt:[]
    },
    id:{
        type:String,
        required:true,
        unique:false
        
    }
})

const PostModel = mongoose.model('Post',PostSchema)

module.exports = PostModel
