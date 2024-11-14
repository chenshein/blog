const mongoose = require('mongoose')
const {models, model, Schema} = require("mongoose");

const PostSchema = new Schema({
    title: String,
    summary: String,
    content: String,
    img: String,
    author:{type: Schema.Types.ObjectId,ref:'User'}
},{
    timestamps: true,
});

const PostModel= model('Post',PostSchema);
module.exports = PostModel;