import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: String, ref: "UserModel", required: true },
  userName: String, // Denormalized for quick display
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const turfSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    image: String,
    images: [String],
    distance: Number,
    rating: Number,
    pricePerHour: Number,
    address: String,
    isFavorite: Boolean,
    description: String,
    amenities: [String],
    openTime: String,
    closeTime: String,
    location: String,
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
  },
  { collection: "turfs" }
);
export default turfSchema;
