import User from "../models/User.js";

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err });
  }
};

// GET single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err });
  }
};

// POST create user
export const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "User creation failed", error: err });
  }
};

// PATCH approve user
export const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Approval failed", error: err });
  }
};

// PATCH reject user
export const rejectUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { approved: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Rejection failed", error: err });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const removed = await User.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted", user: removed });
  } catch (err) {
    res.status(500).json({ message: "User deletion failed", error: err });
  }
};

// GET user by email
export const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user by email", error: err });
  }
};

// Add a favorite
export const addFavorite = async (req, res) => {
  const { userId, listingId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Add to the favorites array
    if (!user.favorites) {
      user.favorites = []; // Initialize as an empty array if null
    }

    if (!user.favorites.includes(listingId)) {
      user.favorites.push(listingId); // Add the listing to favorites
    }

    await user.save();
    res.status(200).json(user.favorites); // Return the updated favorites array
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a favorite
export const removeFavorite = async (req, res) => {
  const { userId, listingId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure favorites array exists and is not null or undefined
    if (!user.favorites || user.favorites.length === 0) {
      return res.status(400).json({ message: "No favorites to remove" });
    }

    // Ensure that favorites is an array and listingId is valid
    user.favorites = user.favorites.filter(
      (id) => id && id.toString() !== listingId.toString() // Avoid calling .toString() on null or undefined
    );

    await user.save();
    res.status(200).json(user.favorites); // Return the updated favorites list as an array
  } catch (error) {
    console.error("Error removing favorite:", error);
    res
      .status(500)
      .json({ message: "Error removing favorite", error: error.message });
  }
};

// GET user's favorite listings
export const getFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the favorites as a clean list of listings
    const favorites = user.favorites.map((fav) => ({
      _id: fav._id,
      title: fav.title,
      price: fav.price,
      location: fav.location,
      images: fav.images,
      description: fav.description,
    }));

    res.status(200).json(favorites); // Return a clean list of favorites
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
