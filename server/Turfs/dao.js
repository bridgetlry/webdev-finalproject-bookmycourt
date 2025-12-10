import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export default function TurfsDao(db) {
  async function findAllTurfs() {
    return model.find({}).then((turfs) =>
      turfs.map((turf) => ({
        ...turf.toObject(),
        id: turf._id,
      }))
    );
  }

  async function findTurfById(turfId) {
    return model.findById(turfId).then((turf) => {
      if (!turf) {
        return null;
      }
      return {
        ...turf.toObject(),
        id: turf._id,
      };
    });
  }

  async function findTurfsForUser(userId) {
    const { bookings } = db;
    const turfs = await model.find();
    const bookedTurfs = turfs.filter((turf) =>
      bookings.some(
        (booking) => booking.user === userId && booking.turf === turf._id
      )
    );
    return bookedTurfs;
  }

  function createTurf(turf) {
    const newTurf = { ...turf, _id: uuidv4() };
    console.log("New turf: ", newTurf);
    return model.create(newTurf);
  }

  function deleteTurf(turfId) {
    return model.deleteOne({ _id: turfId });
  }

  function updateTurf(turfId, turfUpdates) {
    return model.updateOne({ _id: turfId }, { $set: turfUpdates });
  }

  async function addReview(turfId, review) {
    const turf = await model.findById(turfId);
    turf.reviews.push(review);

    const totalRating = turf.reviews.reduce((sum, r) => sum + r.rating, 0);
    turf.averageRating = totalRating / turf.reviews.length;

    await turf.save();
    return turf;
  }

  async function deleteReview(turfId, reviewId) {
    const turf = await model.findById(turfId);
    turf.reviews = turf.reviews.filter((r) => r._id.toString() !== reviewId);

    if (turf.reviews.length > 0) {
      const totalRating = turf.reviews.reduce((sum, r) => sum + r.rating, 0);
      turf.averageRating = totalRating / turf.reviews.length;
    } else {
      turf.averageRating = 0;
    }

    await turf.save();
    return turf;
  }

  async function findReviewsByUser(userId) {
    const turfs = await model.find({ "reviews.user": userId });

    const userReviews = [];
    turfs.forEach((turf) => {
      const reviews = turf.reviews.filter((r) => r.user === userId);
      reviews.forEach((review) => {
        userReviews.push({
          ...review.toObject(),
          turfId: turf._id,
          turfName: turf.name,
          turfImage: turf.image,
        });
      });
    });

    return userReviews;
  }

  return {
    findAllTurfs,
    findTurfById,
    findTurfsForUser,
    createTurf,
    deleteTurf,
    updateTurf,
    addReview,
    deleteReview,
    findReviewsByUser,
  };
}
