require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const connectdb = require("./ConnectDB/connect")
const router = require("./Router/handler")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const session = require("express-session")

port = process.env.port || 5500

const app = express()
app.use(passport.initialize())

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
    secret:'milan',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 24 * 64000}
}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/api/v1", router)

app.listen(port, () =>{
    connectdb()
    console.log(`server connected on ${port}`)
})