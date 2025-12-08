import { Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as client from "./client";
import { useEffect } from "react";
import { setBookings } from "./reducer";
import { setTurfs } from "../../../reducer";
import { Link } from "react-router-dom";
import BookingControlButtons from "./BookingControlButtons";

export default function MyBookings() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { bookings } = useSelector((state: any) => state.bookingsReducer);

    const onRemoveBooking = async (bookingId: string) => {
        try {
            await client.deleteBooking(bookingId);
            console.log(`Booking ${bookingId} deleted successfully.`);
            // Refresh bookings after deletion
            if (currentUser?._id) {
                const updatedBookings = await client.fetchAllUserBookings(currentUser._id);
                dispatch(setBookings(updatedBookings));
            }
        } catch (error) {
            console.error(`Error deleting booking ${bookingId}:`, error);
        }
    }
    const fetchTurfs = async () => {
        try {
            const turfs = await client.fetchAllTurfs();
            dispatch(setTurfs(turfs));
        } catch (error) {
            console.error("Error fetching turfs:", error);
        }
    }
    const fetchBookings = async () => {
        try {
            if (currentUser?._id) {
                const bookings = await client.fetchAllUserBookings(currentUser._id);
                console.log("Fetched bookings:", bookings);
                dispatch(setBookings(bookings));
            } else {
                console.log("No currentUser._id, skipping fetch");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    }


    useEffect(() => {
        fetchTurfs();
        fetchBookings();
    }, [currentUser]);


    return (
        <div className="my-bookings">
            <h2>My Bookings</h2>
            <div>
                {bookings.length === 0 ?
                    <h4>No bookings yet</h4>
                    : <div>
                        {bookings.map((booking: { _id: string; turf: { _id: any; name: string }; bookingDate: string; bookingTime: string }) => (
                            <div>
                                <Link to={`/turf/${booking.turf._id}`} key={booking.turf._id + booking.bookingDate + booking.bookingTime}>
                                    <Col className="bookingName">{booking.turf.name}</Col>
                                    <Col className="bookingDateTime">Booked for: {booking.bookingDate} at {booking.bookingTime}</Col>
                                </Link>
                                <BookingControlButtons bookingId={booking._id} deleteBooking={(bookingId) => { onRemoveBooking(bookingId) }} />
                                <br />
                            </div>

                        ))}
                    </div>
                }
            </div>

        </div>
    )
}