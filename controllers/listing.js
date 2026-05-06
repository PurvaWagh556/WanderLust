const Listing = require("../models/listing.js");
const axios = require("axios");
require("dotenv").config();

module.exports.index = async (req, res, next) => {
    try{
      let { search, category } = req.query;
      let query = {};

      if (search) {
        query.$or = [
          { location: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } }
        ];
      }
      if (category) {
        query.category = category;
      }
      const allListings = await Listing.find(query);

      res.render("listings/index.ejs", { allListings, search, category });
    }catch(err){
      next(err);
    }  
  }

module.exports.renderNewForm = (req, res)=>{
  res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res)=>{
  const {id} = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  })
  .populate("owner");
  if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next) => {
    try{
      let location = req.body.listing.location;
      let geoRes = await
      axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${process.env.GEOAPIFY_KEY}`);
      if (!geoRes?.data?.features?.length) {
        req.flash("error", "Invalid Location");
        return res.redirect("/listings/new");
      }
      let coordinates = geoRes.data.features[0].geometry.coordinates;
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      if (!req.file) {
        req.flash("error", "Image upload failed!");
        return res.redirect("/listings/new");
      }
      let url = req.file.path;
      let filename = req.file.filename;
      newListing.image = { url, filename };
      newListing.geometry = {
        type: "Point",
        coordinates: coordinates,
      }
      await newListing.save();
      req.flash("success", "New Listing Created!");
      res.redirect("/listings");
    }catch(err){
      next(err);
    } 
  };

module.exports.renderEditForm = async(req, res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_100,w_100");
  res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res, next) => {
    try{
      let { id } = req.params;

      let listing = await Listing.findById(id);

      if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
      }
      let newLocation = req.body.listing.location;

      if (newLocation !== listing.location) {
        let geoRes = await axios.get(
          `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(newLocation)}&apiKey=${process.env.GEOAPIFY_KEY}`
        );

        if (geoRes?.data?.features?.length > 0) {
          let coordinates = geoRes.data.features[0].geometry.coordinates;

          listing.geometry = {
            type: "Point",
            coordinates
          };
        } else {
          req.flash("error", "Invalid Location");
          return res.redirect(`/listings/${id}/edit`);
        }
      }

      listing.set(req.body.listing);

      if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
      }
      await listing.save();

      req.flash("success", "Listing Updated!");
      res.redirect(`/listings/${id}`);
    }catch(err){
      next(err);
    }
  };

module.exports.deleteListing = async(req, res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};