const mongoose = require("mongoose");

const TokenSchema = mongoose.Schema({
    token:{
        type:String,
        required:true,
    }
    ,
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        unique:false
    }
})

const TokenModel = mongoose.model('Token',TokenSchema)

module.exports = TokenModel
