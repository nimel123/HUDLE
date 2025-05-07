const express=require('express');
const ctrl=require('../Controller/SignUp');

const router=express.Router();


router.post('/signup',ctrl.SignUp);
router.post('/otp',ctrl.OTP);
router.post('/login',ctrl.Login);
router.put('/update/:id',ctrl.Update);
router.get('/getuser/:id',ctrl.GetUser);
router.delete('/delete/:id',ctrl.Delete);
router.put('/forgetpassword',ctrl.ForgetPassword);


module.exports=router;