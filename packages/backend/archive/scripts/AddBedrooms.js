import mongoose from "mongoose";
import Listing from "./models/Listing.js"; // Adjust the path if necessary

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/realestate", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const updateListingsBedrooms = async () => {
  try {
    // Find all listings that do not have the 'bedrooms' field
    const listings = await Listing.find({ bedrooms: { $exists: false } });

    // Check if there are any listings missing the 'bedrooms' field
    if (listings.length === 0) {
      console.log("All listings already have the bedrooms field.");
      mongoose.disconnect();
      return;
    }

    // Iterate over each listing and update the 'bedrooms' field
    for (let listing of listings) {
      const updatedData = {
        bedrooms: 3, // Example: Set bedrooms to 3, adjust accordingly
      };

      // Update the listing with the new 'bedrooms' value
      await Listing.findByIdAndUpdate(listing._id, updatedData, { new: true });
      console.log(`Updated listing with ID: ${listing._id}`);
    }

    console.log("All listings have been updated with the bedrooms field.");
    mongoose.disconnect(); // Disconnect after script completes
  } catch (error) {
    console.error("Error updating listings:", error);
    mongoose.disconnect();
  }
};

// Run the script
updateListingsBedrooms();
