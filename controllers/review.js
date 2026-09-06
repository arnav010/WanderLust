const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");



module.exports.newReview =wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    await newReview.save();
    listing.reviews.push(newReview);

    await listing.save();
    req.flash("success","New review created")
    res.redirect(`/listings/${listing._id}`);
})

module.exports.destroyReview =  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
   
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","New review deleted")

    res.redirect(`/listings/${id}`);
})