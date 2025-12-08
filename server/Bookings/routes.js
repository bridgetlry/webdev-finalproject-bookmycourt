import BookingsDao from './dao.js';

export default function BookingRoutes(app, db) {
    const dao = BookingsDao(db);

    const bookTurf = async (req, res) => {
        const { turfId, userId } = req.params;
        const { date, time } = req.body;
        const newBooking = await dao.bookTurf(userId, turfId, time, date);
        res.send(newBooking);
    }

    const deleteBooking =  async (req, res) => {
        const { bookingId } = req.params;
        const status = await dao.deleteBooking(bookingId);
        res.send(status);
    }

    const fetchAllBookings = async (req, res) => {
        const bookings = await dao.findAllBookings();
        res.json(bookings);
    };

    const fetchBookingsForUser = async (req, res) => {
        const { userId } = req.params;
        const bookings = await dao.findBookingsforUser(userId);
        //console.log("Bookings fetched: ", bookings);
        res.json(bookings);
        // console.log("fetch bookings called");
        // let { userId } = req.params;
        // if (userId === "current") {
        //     const currentUser = req.session["currentUser"];
        //     if (!currentUser) {
        //         res.sendStatus(401);
        //         return;
        //     }
        //     userId = currentUser._id;
        // }
        // const bookings = await dao.findTurfsForUser(userId);
        // res.json(bookings);
    };
 
    app.post("/api/turfs/:turfId/bookings/:userId", bookTurf);
    app.delete("/api/bookings/:bookingId", deleteBooking);
    app.get("/api/bookings", fetchAllBookings);
    app.get("/api/users/:userId/bookings", fetchBookingsForUser);
}