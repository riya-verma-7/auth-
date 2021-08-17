//jshint esversion:6
require('dotenv').config();
// we don't need it ever again,it will be active and running so we don't need to store it under a variable and it should be coded at the top to ensure the use of env variables at any stage of the program 

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true })

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// const secret = "Thisisourlittlesecret"; we will take this to env file 
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });



//plugins are extra bits of packaged codes that you can add to give more functionality to schema 


const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.get("/register", (req, res) => {
    res.render("register");
})

// If they have been registered to the website,they can access the secrets page . 
//save: automatically password will be encypted, and when we find the password field will be decrypted 


app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets")
        }
    });
})

//authentication check: whether the user with this email exists and the password matches to the entered password then he can access the secrets page 

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets")
                }
            }
        }
    })
})














app.listen(3000, () => {
    console.log("Server started on port 3000");
})

// --------------------------------------------------
// Level 1 security: Creating an account for the user and storing thier email and password, so when they come back we can check . In order to create a user account and store their email password we will create a users database.
//The passwords are saved in the database as a plain text which is very much accessible by any employee this is pretty problematic 
//Make different passwords for different accounts especially if they are linked to some payment pages 
// ---------------------------------------------------------
/* Level 2 Improving user security: ENCRIPTION : scrambling something into a secret code which is not readable by other people who are not involved in that project 
eg: ENIGMA MACHINE WORLD WAR 
Caesar Cipher : julius caesar he encripted his messages 
ABCDEFG 
number of letters you would shift by 
HELLO 
cryptic.com 
All encriptions work the same way ,you have a way of scrambling a message and it requires a key to unscramble it 
we are going to use mongoose-encription package 
It can encript and authenticate 
Now if somebody tries to hack into the database they will not be able to see the password its all in binary format 
-----------------------------------------------------
Using Environment variables to keep secrets safe 
If i push these files to github rep and then it is on the internet and accessible to anyone , anyone can decrypt this 
people can steal.its easily searchable . For us to collaborate with people and use version control we can use env variables where we can keep our API keys and sensitive variables such as API keys and security keys 
using dotenv package 
1. require,config
2.Make a .env file in root dir ,it is a hidden file only visible ls -a 
It is a simple text file we don't need any commas or symbols and snake casing is prefered . 
Now ,we need a gitignore file so that this .env is not pushed to remote and is ignored .
*/
// ------------------------------------------------