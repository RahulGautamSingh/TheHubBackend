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
        unique:false,
        ref:'User'
    },
    likes:{
        type:[mongoose.SchemaTypes.ObjectId],
        required:true,
        unique:false,
        defualt:[],
        ref:'User'
    },
  
})

const PostModel = mongoose.model('Post',PostSchema)

module.exports = PostModel
