const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { deleteChatController } = require('./chat.controller');
const chatModel = require('../models/chat.model');


async function registerUserController(req,res) {
    const {fullName : {firstName, lastName}, email, password} = req.body;

    const isUserExists = await userModel.findOne({ email });

    if(isUserExists){
        res.status(400).json({
            message : "user already exists"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName :{
            firstName,
            lastName
        },
        email,
        password : hashPassword
    })

    const token = jwt.sign({id : user._id}, process.env.JWT_SECRET);

    res.cookie('token', token);

    res.status(201).json({
        message : "user registered successfully",
        user:{
            email: user.email,
            _id : user._id,
            fullName: user.fullName
        }
    })
}


async function loginUserController(req, res) {
    const {email, password} = req.body;

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if(!isPasswordValid){
        return res.status(400).json({
            message : "Invalid email or password"
        })
    }

    const token = jwt.sign({id : user._id}, process.env.JWT_SECRET);

    res.cookie("token", token);

    res.status(200).json({
        message : "user logged in successfully",
        user: {
            email: user.email,
            _id : user._id,
            fullName: user.fullName
        }
    })
}

async function logoutUserController(req,res) {
    res.clearCookie('token');
    res.status(200).json({
        message : "user logged out successfully"
    })
}

async function deleteAccountController(req, res) {

  const user = req.user; // assuming authenticated user

  try {
    // 1. Find all chats belonging to this user
    const chats = await chatModel.find({ user: user._id });

    // 2. Delete each chat (and its messages via your existing chat deletion logic)
    for (let chat of chats) {
      await deleteChatController({ params: { chatId: chat._id }, user }, { status: () => ({ json: () => {} }) });
    }

    // 3. Delete the user itself
    await userModel.findByIdAndDelete(user._id);

    res.status(200).json({ message: "User and all related chats/messages deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    deleteAccountController
}