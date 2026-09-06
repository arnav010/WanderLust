const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}
module.exports.renderNew = (req, res) => {
  res.render("listings/new.ejs");
}
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({
    path: "reviews", populate: {
      path: "author"
    }
  }).populate("owner");
  let currUser= req.user;
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist ")
    res.redirect("/listings");
  }
  
  else res.render("listings/show.ejs", { listing,currUser});
}

module.exports.createRoute = async (req, res) => {
  if (!req.file) {
    req.flash("error", "Please upload a listing image.");
    return res.redirect("/listings/new");
  }

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
   await newListing.save();
  
  req.flash("success", "New listing created");
  res.redirect("/listings");
}


module.exports.editListings =  async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist ")
    res.redirect("/listings");
  }
  else res.render("listings/edit.ejs", { listing });
}

module.exports.editUpdatedListing = async (req, res) => {
  const { id } = req.params;
  const updatedListing = req.body.listing;
  let listing = await Listing.findByIdAndUpdate(id, updatedListing);
  if( typeof req.file!=="undefined"){
    let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  await listing.save(); 
  
  }
  
  req.flash("success", "listing updated")

  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted! ")
  res.redirect("/listings");
}

module.exports.searchFunction = async(req, res) => {
  const destination = req.query.destination;
 
  const listing = await Listing.findOne({ country: destination }).populate({
    path: "reviews", populate: {
      path: "author"
    }
  }).populate("owner");
  let currUser= req.user;
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist ")
    res.redirect("/listings");
  }
  
  else res.render("listings/show.ejs", { listing,currUser});
}
