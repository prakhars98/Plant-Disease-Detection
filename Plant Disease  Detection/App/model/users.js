const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        
        password:{
            type:String,
            required: true
        },
        mobile:{
            type:Number,
            required: true
        }

    }
)
const User = mongoose.model('User', userSchema);
module.exports = User;