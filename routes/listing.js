const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.get("/new",isLoggedIn,listingControllers.renderNew);
router.get("/:id/edit",isLoggedIn,listingControllers.editListings);
router.get("/search",listingControllers.searchFunction);


router.route("/")
.get(wrapAsync(listingControllers.index))
.post(isLoggedIn,upload.single("listing[image][url]"), listingControllers.createRoute)



router.route("/:id")
.delete(isLoggedIn,isOwner,listingControllers.destroyListing)
.get(listingControllers.showListing)
.put(isLoggedIn,isOwner,upload.single("listing[image][url]"), listingControllers.editUpdatedListing)






module.exports=router;