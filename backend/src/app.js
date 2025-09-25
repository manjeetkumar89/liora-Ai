const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
})); // Enable CORS for all routes
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));


app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('*name', (req,res)=>{
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

module.exports = app;
