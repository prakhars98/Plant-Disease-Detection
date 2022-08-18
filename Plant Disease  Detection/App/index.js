const express = require("express")
const app = express()
const mongoose = require("mongoose")
const passport = require('passport');
const session = require('express-session');
const db = require('./config/keys').MongoURI;
const cors = require('cors');
app.use(cors());
mongoose.connect(db, {useNewUrlParser:true}).then(()=>console.log("MongoDB connected")).catch(err=>console.log(err));
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', require('./controller/controller'));
app.use('/register', require('./controller/controller'));
app.use('/upload', require('./controller/controller'));
app.listen(process.env.PORT,console.log("The server is running"))
