import TurfsDao from "./dao.js";
import BookingsDao from "../Bookings/dao.js";
import addNewCourtToLocation from "../Locations/dao.js";

export default function TurfRoutes(app, db) {
  const dao = TurfsDao(db);
  const bookingsDao = BookingsDao(db);

  const findAllTurfs = async (req, res) => {
    const turfs = await dao.findAllTurfs();
    res.send(turfs);
  };

  const findTurfById = async (req, res) => {
    const { turfId } = req.params;
    const turf = await dao.findTurfById(turfId);
    res.send(turf);
  };

  const findTurfsForUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const turfs = await bookingsDao.findTurfsForUser(userId);
    res.json(turfs);
  };

  const createTurf = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const newTurf = await dao.createTurf(req.body);
    const locationUpdate = await addNewCourtToLocation(newTurf.locationId); // Use locationId, not location
    console.log(`${locationUpdate._id} Added a new turf`);
    res.json(newTurf);
  };

  const deleteTurf = async (req, res) => {
    const { turfId } = req.params;
    await bookingsDao.deleteAllBookingsForTurf(courseId);
    const status = await dao.deleteTurf(turfId);
    res.send(status);
  };

  const updateTurf = async (req, res) => {
    const { turfId } = req.params;
    const turfUpdates = req.body;
    const status = await dao.updateTurf(turfId, turfUpdates);
    res.send(status);
  };

  const bookTurf = async (req, res) => {
    let { uid, tid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await bookingsDao.bookTurf(uid, tid);
    res.send(status);
  };

  const deleteBookingForUser = async (req, res) => {
    let { uid, tid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await bookingsDao.deleteBookingForUser(uid, tid);
    res.send(status);
  };

  const addReview = async (req, res) => {
    const { turfId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      return res.status(401).json({ error: "Must be logged in to review" });
    }

    const review = {
      user: currentUser._id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      rating: req.body.rating,
      comment: req.body.comment,
      createdAt: new Date(),
    };

    const updatedTurf = await dao.addReview(turfId, review);
    res.json(updatedTurf);
  };

  const deleteReview = async (req, res) => {
    const { turfId, reviewId } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const updatedTurf = await dao.deleteReview(turfId, reviewId);
    res.json(updatedTurf);
  };

  app.get("/api/turfs", findAllTurfs);
  app.get("/api/turfs/:turfId", findTurfById);
  app.get("/api/users/:userId/turfs", findTurfsForUser);
  app.post("/api/turfs/new", createTurf);
  app.delete("/api/turfs/:turfId", deleteTurf);
  app.put("/api/turfs/:turfId", updateTurf);
  app.post("/api/users/:uid/turfs/:tid", bookTurf);
  app.delete("/api/users/:uid/turfs/:cid", deleteBookingForUser);
  app.post("/api/turfs/:turfId/reviews", addReview);
  app.delete("/api/turfs/:turfId/reviews/:reviewId", deleteReview);
}
