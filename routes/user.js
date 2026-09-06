const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const userControllers = require("../controllers/user.js");


router
   .route("/signup")
   .get(userControllers.userSignUp)
   .post(wrapAsync(userControllers.newUser))


router.route("/login")
   .get( userControllers.userLogin)
   .post(passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),userControllers.authenticateUser)



router.get("/logout",userControllers.logoutUser);

module.exports = router;