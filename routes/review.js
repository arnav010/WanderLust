const express = require("express");
const router = express.Router({mergeParams:true});


const {isLoggedIn,isReviewAuthor,validateReview} = require("../middleware.js");
const reviewControllers = require("../controllers/review.js");



router.post("/",isLoggedIn, validateReview, reviewControllers.newReview);



router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reviewControllers.destroyReview)

module.exports = router;