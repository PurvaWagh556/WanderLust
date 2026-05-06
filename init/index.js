require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const axios = require("axios");
const API_KEY = process.env.GEOAPIFY_KEY;

const MONGO_URL = "mongodb://localhost:27017/wanderlust";

main().then(()=>{
  console.log("connected to DB");
}).catch((err)=>{
  console.log(err);
})
async function main(){
  await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=> ({
    ...obj, 
    owner: '69f4696edb33a20dc588e034'
  }));
  for (let listing of initData.data) {
    try {

      let geoRes = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(listing.location)}&apiKey=${API_KEY}`
      );

      if (geoRes.data.features && geoRes.data.features.length > 0) {
        listing.geometry = {
          type: "Point",
          coordinates: geoRes.data.features[0].geometry.coordinates
        };
        console.log(`Success: ${listing.location}`);
      } else {
        listing.geometry = { 
          type: "Point", 
          coordinates: [0, 0] 
        }; 
        console.log(`Defaulted: ${listing.location}`);
      }
    } catch (err) {
      console.error(`Error for ${listing.location}:`, err.message);
      listing.geometry = { type: "Point", coordinates: [0, 0] };
      
      if (err.response && err.response.status === 429) {
        console.log("Rate limit hit! Waiting 3 seconds...");
        await delay(3000);
      }
    }
  }
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
}

initDB();
