import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
} from "react-icons/fa";
import type {
  TurfDetails as TurfDetailsType,
  TimeSlot,
} from "../types/turf.types";
import { getTurfById } from "../data/mockTurfs";
import "./TurfDetails.css";
import { bookTurf, addReview, deleteReview } from "./client";
import { useSelector, useDispatch } from "react-redux";
import { setBookings } from "./Account/Profile/MyBookings/reducer";

const HTTP_SERVER = import.meta.env.VITE_API_URL || "";

const TurfDetails: React.FC = () => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const bookings = useSelector((state: any) => state.bookingsReducer.bookings);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [turf, setTurf] = useState<TurfDetailsType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchTurfDetails();
    fetchAllBookings();
    generateDates();
  }, [id]);

  // Regenerate time slots whenever bookings, selectedDate, or turf change
  useEffect(() => {
    if (turf) {
      setTimeSlots(generateTimeSlots(turf.pricePerHour));
    }
  }, [bookings, selectedDate, turf]);

  const generateDates = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
  };

  const fetchTurfDetails = async () => {
    try {
      const response = await fetch(`${HTTP_SERVER}/api/turfs/${id}`);
      const data = await response.json();
      setTurf(data);
      setIsFavorite(data.isFavorite);
      setTimeSlots(generateTimeSlots(data.pricePerHour));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching turf details:", error);
      loadMockData();
    }
  };

  const fetchAllBookings = async () => {
    try {
      const response = await fetch(`${HTTP_SERVER}/api/bookings`);
      const data = await response.json();
      dispatch(setBookings(data));
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Check if a given time (slotTime) on the currently selected date on the current turf (param id) is booked.
  // If slotTime is omitted, fall back to the currently selected slot's time.
  function isBooked(slotTime?: string): boolean {
    const timeToCompare = slotTime ?? (selectedSlot ? selectedSlot.time : "");
    return bookings.some(
      (booking: {
        turf: { _id: string };
        bookingDate: string;
        bookingTime: string;
      }) =>
        booking.turf._id === id &&
        booking.bookingDate === selectedDate &&
        booking.bookingTime.substring(0, 5) === timeToCompare.substring(0, 5)
    );
  }

  const loadMockData = () => {
    if (!id) {
      setLoading(false);
      return;
    }

    const foundTurf = getTurfById(id);

    if (foundTurf) {
      setTurf(foundTurf);
      setIsFavorite(foundTurf.isFavorite);
      setTimeSlots(generateTimeSlots(foundTurf.pricePerHour));
    }

    setLoading(false);
  };

  const generateTimeSlots = (basePrice: number): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 6;
    const endHour = 22;

    for (let hour = startHour; hour < endHour; hour++) {
      const timeString = `${hour.toString().padStart(2, "0")}:00`;
      const endTimeString = `${(hour + 1).toString().padStart(2, "0")}:00`;

      // Peak hours (6-9 PM) have higher prices
      const isPeakHour = hour >= 18 && hour < 21;
      const price = isPeakHour ? basePrice + 3 : basePrice;

      slots.push({
        id: `slot-${hour}`,
        time: `${timeString} - ${endTimeString}`,
        // Check availability for this specific slot time instead of relying on `selectedSlot`.
        isAvailable: !isBooked(`${timeString} - ${endTimeString}`),
        //Math.random() > 0.3,
        price: price,
      });
    }
    return slots;
  };

  const getNextDays = (): { date: string; display: string; day: string }[] => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = date.getDate().toString();
      days.push({ date: dateStr, display: dayNum, day: dayName });
    }
    return days;
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    // Regenerate slots for the new date (availability may differ)
    if (turf) {
      setTimeSlots(generateTimeSlots(turf.pricePerHour));
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.isAvailable) {
      setSelectedSlot(slot);
    }
  };

  const handleBookNow = () => {
    if (selectedSlot) {
      if (selectedDate) {
        if (turf) {
          if (currentUser) {
            bookTurf(
              currentUser?._id,
              turf.id,
              selectedDate,
              selectedSlot.time
            );
            alert(
              `✅ Booking confirmed for ${turf.name} on ${selectedDate} (${selectedSlot.time})`
            );
          } else {
            navigate("/signin", {
              state: { from: `/turf/${id}` },
            });
            alert("Please log in to book a turf.");
          }
        } else {
          alert("Please select a turf");
        }
      } else {
        alert("Please select a date.");
      }
    } else {
      alert("Please select a time slot.");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="turf-details-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="turf-details-container">
        <div className="error">Turf not found</div>
      </div>
    );
  }

  const handleSubmitReview = async () => {
    if (!currentUser) {
      alert("Please sign in to leave a review");
      navigate("/signin");
      return;
    }

    try {
      await addReview(turf.id, newReview);
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);
      fetchTurfDetails();
      alert("Review submitted successfully!");
    } catch (error) {
      alert("Error submitting review");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm("Delete this review?")) {
      await deleteReview(turf.id, reviewId);
      fetchTurfDetails();
    }
  };

  return (
    <>
      <div className="turf-details-container">
        {/* Header Image */}
        <div className="turf-image-header">
          <img src={turf.image} alt={turf.name} className="turf-main-image" />
          <div className="image-overlay">
            <button className="back-btn" onClick={handleBack}>
              <FaArrowLeft />
            </button>
            <button className="favorite-btn-header" onClick={toggleFavorite}>
              {isFavorite ? (
                <FaHeart className="heart-icon active" />
              ) : (
                <FaRegHeart className="heart-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Turf Info */}
        <div className="turf-info-section">
          <div className="turf-title-row">
            <h1 className="turf-title">{turf.name}</h1>
            <div className="turf-rating">
              <FaStar className="star-icon" />
              <span>{turf.rating}</span>
            </div>
          </div>

          <div className="turf-address-row">
            <FaMapMarkerAlt className="address-icon" />
            <span>{turf.address}</span>
          </div>

          <div className="turf-distance-price">
            <span className="distance-info">{turf.distance} km away</span>
            <span className="base-price">
              Starting at ${turf.pricePerHour}/hr
            </span>
          </div>

          {turf.description && (
            <p className="turf-description">{turf.description}</p>
          )}

          {turf.amenities && turf.amenities.length > 0 && (
            <div className="amenities-section">
              <h3>Amenities</h3>
              <div className="amenities-list">
                {turf.amenities.map((amenity, index) => (
                  <span key={index} className="amenity-tag">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date Selection */}
        <div className="date-section">
          <h3>Select Date</h3>
          <div className="date-picker">
            {getNextDays().map((day) => (
              <div
                key={day.date}
                className={`date-item ${
                  selectedDate === day.date ? "selected" : ""
                }`}
                onClick={() => handleDateSelect(day.date)}
              >
                <span className="day-name">{day.day}</span>
                <span className="day-number">{day.display}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="slots-section">
          <h3>Available Time Slots</h3>
          <div className="slots-grid">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className={`slot-item ${
                  !slot.isAvailable ? "unavailable" : ""
                } ${selectedSlot?.id === slot.id ? "selected" : ""}`}
                onClick={() => handleSlotSelect(slot)}
              >
                <span className="slot-time">{slot.time}</span>
                <span className="slot-price">${slot.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        {selectedSlot && (
          <div className="pricing-summary">
            <div className="summary-row">
              <span>Turf</span>
              <span>{turf.name}</span>
            </div>
            <div className="summary-row">
              <span>Selected Slot</span>
              <span>{selectedSlot.time}</span>
            </div>
            <div className="summary-row">
              <span>Date</span>
              <span>{new Date(selectedDate).toLocaleDateString()}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${selectedSlot.price}</span>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div
          className="reviews-section"
          style={{ padding: "20px", borderTop: "1px solid #eee" }}
        >
          {/* Header with Review Count and Write Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3>Reviews ({turf.reviews?.length || 0})</h3>
            {currentUser && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? "Cancel" : "Write Review"}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div
              style={{
                background: "#f9f9f9",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <label>Rating:</label>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "24px",
                        cursor: "pointer",
                        color: star <= newReview.rating ? "#ffc107" : "#ddd",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label>Comment:</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  placeholder="Share your experience..."
                />
              </div>

              <button
                className="btn btn-success"
                onClick={handleSubmitReview}
                disabled={!newReview.comment.trim()}
              >
                Submit Review
              </button>
            </div>
          )}

          {/* Display Reviews */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {turf.reviews && turf.reviews.length > 0 ? (
              turf.reviews.map((review: any) => (
                <div
                  key={review._id}
                  style={{
                    background: "#fff",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <div>
                      {/* Clickable username linking to public profile */}
                      <Link
                        to={`/users/${review.user}`}
                        style={{
                          textDecoration: "none",
                          color: "#007bff",
                          fontWeight: "600",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        {review.userName}
                      </Link>
                      <div
                        style={{
                          color: "#ffc107",
                          fontSize: "14px",
                          marginTop: "4px",
                        }}
                      >
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <p style={{ margin: "8px 0", color: "#333" }}>
                    {review.comment}
                  </p>

                  {/* Delete button (only for review author or admin) */}
                  {currentUser &&
                    (currentUser._id === review.user ||
                      currentUser.role === "ADMIN") && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteReview(review._id)}
                        style={{ marginTop: "8px" }}
                      >
                        Delete
                      </button>
                    )}
                </div>
              ))
            ) : (
              <p
                style={{ color: "#999", textAlign: "center", padding: "20px" }}
              >
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>

        {/* Book Now Button */}
        <div className="book-section">
          <button
            className={`book-now-btn ${!selectedSlot ? "disabled" : ""}`}
            onClick={handleBookNow}
            disabled={!selectedSlot}
          >
            {selectedSlot
              ? `Book Now - $${selectedSlot.price}`
              : "Select a Time Slot"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TurfDetails;
