const mongoose = require('mongoose')
const {models, model} = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true}
});

const UserModel= model('User',UserSchema); //define a model named 'User' according to the UserSchema
module.exports = UserModel;
