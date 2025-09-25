const {Server} = require('socket.io');

//third party library to parse cookies sent by the client during establishment of the websocket connection for authentication
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const aiService = require('../services/ai.service');
const messageModel = require('../models/message.model');
const {createMemory, queryMemory} = require('../services/vector.service');


function initSocketServer(httpServer){
    const io = new Server(httpServer,{
        cors : {
            origin : "http://localhost:4173", //frontend url
            credentials : true
        }
    });

    //socket.io middleware to authenticate users
    io.use(async (socket, next)=>{
        const cookies = cookie.parse(socket.handshake.headers?.cookie || '');

        if(!cookies.token){
            next(new Error("Authentication error : Token not found"));
        }
        
        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id).select('-password -__v'); // Fetch user details excluding password and version
            socket.user = user; // Attach user info to the socket
            next();
        } catch (error) {
            next(new Error("Authentication error : Invalid token"));
        }
    })

   io.on('connection', (socket) => {
       console.log('New client connected: ' + socket.id);

       socket.on("ai-message", async(messagePayload)=>{
        socket.emit("ai-typing");
        /*
        //saving user messages to database 
        const message = await messageModel.create({
            chatId: messagePayload.chatId,
            user: socket.user._id,
            content: messagePayload.content,
            role: "user"
        });

        //generating vectors of the user message
        const vectors = await aiService.generateVector(messagePayload.content);
        */

        //creating user message and user message vectors at the same time
        const [message, vectors] = await Promise.all([
            messageModel.create({
                chatId: messagePayload.chatId,
                user: socket.user._id,
                content: messagePayload.content,
                role: "user"
            }),
            aiService.generateVector(messagePayload.content)
        ])

        /*
        //querying vectors from pinecone memory for relevant context or long term past conversations
        const memory = await queryMemory({
            queryVector: vectors,
            limit: 3, //only three records will be fetched at once
            metadata:{}
        })
        */

        
        //saving the vectored user message to pinecone database along with metadata
        await createMemory({
            vectors,
            metadata : {
                chatId: messagePayload.chatId,
                user: socket.user._id,
                text: messagePayload.content
            },
            messageId : message._id
        })

        // const chatHistory = (await messageModel.find({
        //     chatId: messagePayload.chatId
        // }).sort({createdAt : -1} /*sorting messages in decending order*/).limit(20)).reverse();

        const [memory, chatHistory] = await Promise.all([
            queryMemory({
            queryVector: vectors,
            limit: 3, //only three records will be fetched at once
            metadata:{
                user: socket.user._id //fetching memory only for the logged in user
            }
            }),
            messageModel.find({
                chatId: messagePayload.chatId
            }).sort({createdAt : -1}).limit(20).lean().then(messages=> messages.reverse())

        ])

        const shortTermMemory = chatHistory.map(msg => {
            return {
                role : msg.role,
                parts: [{text: msg.content}]
            }
        });

        const longTermMemory = [
            {
                role: "user",
                parts: [ {
                    text: `these are some previous messages from the chat, use them to generate response
                    ${memory.map(item => item.metadata.text).join("\n")}`
                }]
            }
        ]
        
        const response = await aiService.generateResponse([...longTermMemory, ...shortTermMemory]);

        socket.emit("ai-response", {
            content: response,
            chatId: messagePayload.chatId
        });

        socket.emit("ai-stop-typing");

        /*
        //saving ai responses to database
        const responseMessage = await messageModel.create({
            chatId: messagePayload.chatId,
            user: socket.user._id,
            content: response,
            role: "model"
        })

        //creating vectors of ai messages
        const responseVectors = await aiService.generateVector(response);
        */

        const [responseMessage, responseVectors] = await Promise.all([
            messageModel.create({
                chatId: messagePayload.chatId,
                user: socket.user._id,
                content: response,
                role: "model"
            }),
            aiService.generateVector(response)
        ])


        //saving the vectored ai message to pinecone database along with metadata
        await createMemory({
            vectors: responseVectors,
            messageId: responseMessage._id,
            metadata: {
                chatId: messagePayload.chatId,
                user: socket.user._id,
                text: response
            }
        })
       })
   });
}

module.exports = initSocketServer;
