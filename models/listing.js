const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=652&auto=format&fit=crop",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=652&auto=format&fit=crop"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: [Number] // [lng, lat]
  },
  category: {
    type: String,
    required: true,
    enum: ["Trending",
      "New",
      "Luxe",
      "Lakefront",
      "Historical",
      "Rooms",
      "Iconic Cities",
      "Mountains",
      "Castles",
      "Amazing Pools",
      "Camping",
      "Farms",
      "Arctic",
      "Boats",
      "Domes",
      "TreeHouses",
      "Beach",
      "Mansions",
      "Creative Spaces",
      "Skiing",
      "Hiking",
      "Golfing",
    ]
  }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;