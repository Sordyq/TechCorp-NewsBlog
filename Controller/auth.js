const UserModel = require("../Model/user")
require("dotenv").config()
const bcrypt = require("bcryptjs")
const passport = require("passport")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const Usermodel = require("../Model/user")

const SignUp = async (req,res,)=>{
    const {fullname, username, email, password, confirmedPassword} = req.body
    
    try{
        if(!fullname || !username || !email || !password || !confirmedPassword){
            return res.status(404).json({error: "All fields are required"})
        }
    
        const existingUser = await Usermodel.findOne({email})
        if(existingUser){
            return res.json({error: "User already exist"})
        }
    
        const salt = await bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hashSync(req.body.password,salt)
    
        const newUser = new UserModel({
            fullname:fullname,
            username:username,
            email:email,
            password:hashedPassword,
            confirmedPassword:hashedPassword
        })
    
        UserModel.register(newUser, password, function (err){
            if(err){
                console.log(err)
            }
    
            passport.authenticate("local")(req, res, function (err){
                res.json({msg: "You have successfully signed up"})
            })
        })
    
        const transport = nodemailer.createTransport({
            service: "Gmail",
            auth:{
                user: process.env.my_email,
                pass: process.env.my_password
            },
        })
        
        const mailOptions = {
            from: process.env.my_email,
            to: email,
            subject: "Welcome to TechCorp News",
            text: "Hello! Welcome to TechCorp News Platform. We hope you enjoy your experience. Thank You",
        }
    
        transport.sendMail(mailOptions, function(error, info){
            if(error){
                console.error(error);
            }
        })
    } catch(error){
        console.error(error)
        return res.status(500).json({error:"server error"})
    }
}

const Login = async (req, res) =>{
    const {username, password} = req.body;

    try{
        if(!username){
            res.json({error: "email is required"})
        }
        if(!password){
            res.json({error: "password is required"})
        }
        const existingUser = await Usermodel.findOne({username})
        if(!existingUser){
            return res.status(401).json({error: "user not found, please signup to continue"});
        }
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if(!passwordMatch){
            return res.json({error: "password is incorrect"})
        }

        const user = new Usermodel({
            username,
            password
        })

        req.login(user, function(err){
            if(err){
                return res.json(err)
            }
            passport.authenticate("local")(req, res, function(){
                res.json({msg: "Login successfully"})
            })
        })
    } catch (error){
        console.error(error)
        return res.status(404).json({error: "Server Error"})
    }
}

const Logout = async(req, res) =>{
    req.logout(function(err){
        if(err){
            return res.json(err)
        }
        res.json({msg: "Logout successfully"})
    })
}

const generateRandom = () =>{
    return Math.random().toString() + "qpoe";
}

const forgetPassword = async (req, res) =>{
    const {email} = req.body;
    const id = req.params.id
    console.log(id)
    try{
         const user = await Usermodel.findOne({email})
         if(!user){
            return res.status(404).json({error: "User not found"});
         }

         const token = generateRandom();
         user.resetToken = token
         user.restExpires = Date.now() + 3600000

         await user.save()

         const resetLink = ` ${process.env.LOCALHOST_URL}/reset/${token} `
         console.log("reset link", resetLink)

         const transporter = nodemailer.createTransport({
            service: "Gmail", 
            auth: {
                user: process.env.my_email,
                pass: process.env.my_password,
            },
        });

        const mailOptions = {
            from: process.env.my_email,
            to: user.email,
            subject: "Forget Password Link",
            text: `Dear ${user?.username}, this link is to be followed to reset your password ${resetLink}`,
        }; 
        
        transporter.sendMail(mailOptions, function (error, info){
            if(error){
                console.error(error)
                res.status(500).send("Failed to send email")
            } else {
                console.log("Email sent:" + info.response)
                res.status(200).json({msg: "Reset link sent successfully"})
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Server error"})
    }
}

module.exports = { SignUp, Login, Logout, forgetPassword}