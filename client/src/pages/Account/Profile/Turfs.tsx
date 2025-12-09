/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import * as client from "../../Account/client";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addNewTurf } from "../../reducer";
import { setLocations } from "../../locationReducer";
import { FaSave, FaTimes, FaMapMarkerAlt, FaDollarSign, FaClock, FaCheckCircle } from "react-icons/fa";
import "./Turfs.css";

export default function TurfEditor() {
  const { lid, tid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { turfs } = useSelector((state: any) => state.turfReducer);
  const dispatch = useDispatch();
  const hasShownAlert = useRef(false);
  const { locations } = useSelector((state: any) => state.locationsReducer);

  const existingTurf = turfs.find((t: any) => t._id === tid);
  const existingLocations = locations || [];
  const [turf, setTurf] = useState({
    name: "",
    description: "",
    image: "",
    images: [] as string[],
    pricePerHour: 0,
    address: "",
    openTime: "08:00",
    closeTime: "20:00",
    amenities: [] as string[],
    location: lid || ""
  });

  useEffect(() => {
    if (currentUser && currentUser.role !== 'COURTOWNER' && !hasShownAlert.current) {
      hasShownAlert.current = true;
      window.alert("You do not have permission to create turfs");
      navigate(`/turfs`);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const fetchedLocations = await client.findAllLocations();
        dispatch(setLocations(fetchedLocations));
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, [dispatch]);

  const handleSave = async () => {
    try {
      if (!turf.location) {
        window.alert("Please select a location first!");
        return;
      }

      const newTurf = await client.createTurf(turf);
      dispatch(addNewTurf(newTurf));
      window.alert("Turf created successfully!");
      navigate(`/profile`);
    } catch (error) {
      console.error("Error saving turf:", error);
      window.alert("Error saving turf. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate(`/profile`);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setTurf({ ...turf, amenities: [...turf.amenities, amenity] });
    } else {
      setTurf({ ...turf, amenities: turf.amenities.filter(a => a !== amenity) });
    }
  };

  const handleLocationChange = (locationId: string) => {
    setTurf({ ...turf, location: locationId });
  };

  const availableAmenities = [
    "Bathrooms",
    "Parking",
    "Drinking Water",
    "Lighting",
    "Seating",
    "Lockers",
    "Showers",
    "Equipment Rental"
  ];

  return (
    <div className="turf-editor-container">
      <div className="turf-editor-card">
        <div className="turf-editor-header">
          <h1>Create New Turf</h1>
          <p>Fill in the details below to list your turf on BookMyCourt</p>
        </div>

        <div className="turf-editor-form">
          {/* Turf Name */}
          <div className="form-group">
            <label htmlFor="wd-turf-name">Turf Name</label>
            <input
              type="text"
              id="wd-turf-name"
              className="turf-input"
              placeholder="Enter turf name"
              value={turf.name}
              onChange={(e) => setTurf({ ...turf, name: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="wd-turf-description">Description</label>
            <textarea
              id="wd-turf-description"
              className="turf-textarea"
              rows={5}
              placeholder="Describe the turf facilities, surface type, etc."
              value={turf.description}
              onChange={(e) => setTurf({ ...turf, description: e.target.value })}
            />
          </div>

          {/* Address & Location */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="wd-address">
                <FaMapMarkerAlt /> Address
              </label>
              <input
                type="text"
                id="wd-address"
                className="turf-input"
                placeholder="123 Main St, City, State, ZIP"
                value={turf.address}
                onChange={(e) => setTurf({ ...turf, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="wd-location">Location</label>
              <select
                id="wd-location"
                className="turf-select"
                value={turf.location}
                onChange={(e) => handleLocationChange(e.target.value)}
              >
                <option value="">Select a location</option>
                {existingLocations.map((location: any) => (
                  <option key={location._id} value={location._id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Per Hour */}
          <div className="form-group">
            <label htmlFor="wd-price">
              <FaDollarSign /> Price Per Hour
            </label>
            <input
              type="number"
              id="wd-price"
              className="turf-input"
              placeholder="0.00"
              value={turf.pricePerHour}
              onChange={(e) => setTurf({ ...turf, pricePerHour: Number(e.target.value) })}
              min="5"
              step="0.01"
            />
          </div>

          {/* Operating Hours */}
          <div className="form-group">
            <label>
              <FaClock /> Operating Hours
            </label>
            <div className="operating-hours">
              <div className="time-input-group">
                <label htmlFor="wd-open-time">Open Time</label>
                <input
                  type="time"
                  id="wd-open-time"
                  className="turf-input"
                  value={turf.openTime}
                  onChange={(e) => setTurf({ ...turf, openTime: e.target.value })}
                />
              </div>
              <div className="time-input-group">
                <label htmlFor="wd-close-time">Close Time</label>
                <input
                  type="time"
                  id="wd-close-time"
                  className="turf-input"
                  value={turf.closeTime}
                  onChange={(e) => setTurf({ ...turf, closeTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="form-group">
            <label>Amenities</label>
            <div className="amenities-grid">
              {availableAmenities.map((amenity) => (
                <div key={amenity} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={turf.amenities.includes(amenity)}
                    onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                  />
                  <label htmlFor={`amenity-${amenity}`}>
                    <FaCheckCircle className="check-icon" />
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="turf-editor-actions">
            <button className="turf-cancel-btn" onClick={handleCancel}>
              <FaTimes /> Cancel
            </button>
            <button className="turf-save-btn" onClick={handleSave}>
              <FaSave /> Create Turf
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}