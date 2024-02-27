const express = require("express")
const { SignUp, Login, Logout, forgetPassword} = require("../Controller/auth")
const { singleNews, getAllNews, createNews, updateNews, deleteNews } = require("../Controller/news-controller")
const { isLoggedin, isAdmin } = require("../Middleware/auth")

const router = express.Router()

router.route("/sign-up").post(SignUp)
router.route("/log-in").post(Login)
router.route("/log-out").get(Logout)
router.route("/reset").post(forgetPassword)
router.route("/create-news").post([isLoggedin, isAdmin], createNews)
router.route("/get-news").get([isLoggedin, isAdmin], getAllNews)
router.route("/single-news/:id").get([isLoggedin, isAdmin], singleNews)
router.route("/update-news/:id").patch([isLoggedin, isAdmin], updateNews)
router.route("/delete-news/:id").delete([isLoggedin, isAdmin], deleteNews)

module.exports = router