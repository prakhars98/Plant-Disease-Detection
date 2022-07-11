const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../model/users');
const passport =require('passport');
const mongoose = require('mongoose');
const FormData = require('form-data');
const fetch = require('node-fetch');
const {ensureAuthenticated} = require('../config/auth');
const multer = require("multer")
const fs = require("fs")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })


router.get('/', (req,res)=>res.send('welcome'));

router.get('/login', (req, res)=>res.send('login Page'));

router.post('/login', (req, res, next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next)
});

router.post('/upload',upload.single('file'), function (req, res, next) {
    const form = new FormData();
    form.append("file",fs.createReadStream('./uploads/'+req.file.filename));
    const ans =  fetch(`http://127.0.0.1:8000/predict`, {  method: 'POST', body: form }).then(res => res.json()).then(json => res.send(json));
    
    
  });
  
  

router.post('/register',(req, res)=>{
    console.log(req.body);
    let errors=[];
    const { password, confirmPassword, mobileNo}= req.body;
    if ( !password || !confirmPassword || !mobileNo) 
    {
        errors.push({msg:"Please fill in all fields"});
    }
    
    if(password!==confirmPassword)
    {
        errors.push({msg:"Passwords do not match"});
    }
    if(password.length < 8)
    {
        errors.push({msg:"Password should be atleast 8 characters"});
    }
    if(errors.length>0)
    {   console.log(errors);
        res.send({errors});
    }
    else{
    User.findOne({mobile:mobileNo}).then(user=>{
            if (user){
                errors.push({msg:'User already Registered'});
                res.send({errors});
            }else{
                const newUser = new User({
                    password: password,
                    mobile:mobileNo,
                });
                bcrypt.genSalt(10, (err,salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if (err) throw err;
                        newUser.password=hash;
                        newUser.save().then(user=>{
                            res.send('Registration successful');
                        }).catch(err=>console.log(err));
                    })
                });
            }
        }
        );
    }
    
});
module.exports = router;