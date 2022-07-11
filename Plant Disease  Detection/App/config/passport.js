const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../model/users');

module.exports= function(passport){
    passport.use(
        new LocalStrategy({usernameField:'mobileNo'}, (mobileNo, password, done)=>{
            User.findOne({mobile:mobileNo})
            .then(user=>{
                if(!user){
                    return done(null, false, {message:"Mobile No is not registered"});
                }
                bcrypt.compare(password, user.password, (err,isMatch)=>{
                    if (err) throw err;
                    if(isMatch){
                        return done(null, user);
                    }else{
                        return done(null,false,{message:'Password Incorrect'});
                    }
                });
            })
            .catch((err)=>console.log(err));
        })
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}