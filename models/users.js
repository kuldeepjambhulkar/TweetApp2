const mongoose = require('mongoose');

const Users = new mongoose.Schema(
    {
        DisplayName:{
            type: String,
            required: true
        },
        UserName:{
            type: String,
            required: true
        },
        Bio:{
            type: String,
            required: true
        },
        createdAt:{
            type: Date,
            required: true,
            default: Date.now()
        }
    }

) 



module.exports = mongoose.model('Users', Users);