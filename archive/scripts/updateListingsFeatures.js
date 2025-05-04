import mongoose from "mongoose";
import Listing from "./models/Listing"; // Adjust the path if necessary

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/realestate", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const updateListings = async () => {
  try {
    const listings = await Listing.find(); // Get all the listings

    // Iterate over each listing and update it
    for (let listing of listings) {
      // Add missing properties (you can modify values based on the listing type)
      const updatedData = {
        ...listing._doc,
        bedrooms: 3, // Example, you can customize based on listing
        bathrooms: 3, // Example
        squareFootage: 3000, // Example in square feet
        propertyType: "Villa", // Example, this should match your property types
        yearBuilt: 2020, // Example
        parkingAvailable: "Yes", // Example, or "No"
        amenities: ["Pool", "Gym", "Garden"], // Example amenities, modify accordingly
      };

      // Update the listing in the database
      await Listing.findByIdAndUpdate(listing._id, updatedData, { new: true });
      console.log(`Updated listing with ID: ${listing._id}`);
    }

    console.log("All listings have been updated successfully.");
    mongoose.disconnect(); // Disconnect after script completes
  } catch (error) {
    console.error("Error updating listings:", error);
    mongoose.disconnect();
  }
};

// Run the script
updateListings();
