const { default: mongoose } = require('mongoose');
const chatModel = require('../models/chat.model');
const messageModel = require('../models/message.model');
const { create } = require('../models/user.model');
const { deleteAllMemoriesOfChat } = require('../services/vector.service');

async function createChatController(req,res) {
    const {title} = req.body;
    const user = req.user;

    const chat = await chatModel.create({
        user: user._id,
        title
    });

    res.status(201).json({
        message: "chat created successfully",
        chat:{
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }
    });
}

async function getChats(req,res) {
    const user = req.user;
    const chats = await chatModel.find({user : user._id}).sort({lastActivity : -1});
    res.status(200).json({
        message:"chats fetched successfully",
        chats: chats.map(chat=>({
            _id : chat._id,
            title : chat.title,
            lastActivity : chat.lastActivity,
            user: chat.user
        }))
    })
}

async function deleteChatController(req, res) {
    const user = req.user;
    const {chatId} = req.params;
    // const session = await mongoose.startSession();
    try {
        const pineconeResponse = await deleteAllMemoriesOfChat(chatId);

        await messageModel.deleteMany({
            chatId
        }/*,{session}*/);

        const deletedChat = await chatModel.findOneAndDelete({
            _id : chatId,
            user : user._id
        }/*,{session}*/);
        if(!deletedChat){
            // await session.abortTransaction();
            // session.endSession();
            return res.status(404).json({
                message : "chat not found"
            })
        }

        // await session.commitTransaction();
        // session.endSession();

        res.status(200).json({
            message : "chat deleted successfully"
        })
    } catch (error) {
        // await session.abortTransaction();
        // session.endSession();
        res.status(500).json({
            message: "An error occurred while deleting the chat",
            error: error.message
        });
    }

}

async function getMessagesController(req,res) {
    const user = req.user;
    const {chatId} = req.params;

    try {
        const messages = await messageModel.find({
            chatId: chatId,
            user: user._id
        }).sort({createdAt: 1});
        
        if(!messages.length){
            return res.status(404).json({
                message : "No messages in this chat"
            });
        }
        res.status(200).json({
            message: "Messages fetched successfully",
            messages
        });
    } catch (error) {
        res.status(500).json({
            message : "An error occurred while fetching messages",
            error: error.message
        })
    }
}

module.exports = {
    createChatController,
    getChats,
    deleteChatController,
    getMessagesController
}