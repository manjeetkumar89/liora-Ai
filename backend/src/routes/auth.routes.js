const express = require('express');
const { registerUserController, loginUserController, logoutUserController } = require('../controllers/auth.controller');
const { authUserMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.post('/me', authUserMiddleware, (req,res)=>{
    res.status(200).json({
        message : "user authenticated",
        user : {
            _id : req.user._id,
            email : req.user.email,
            fullName : req.user.fullName
        }
    })
});
router.post('/logout', authUserMiddleware, logoutUserController);

module.exports = router;
