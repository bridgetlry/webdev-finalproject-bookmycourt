"use client";
import { useState, useEffect, useRef } from "react";
import * as client from "../../Account/client";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, FormLabel, Row, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addNewTurf } from "../../reducer";
import { setLocations } from "../../locationReducer";

export default function TurfEditor() {
  const { lid, tid } = useParams(); // lid = location id, tid = turf id
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { turfs } = useSelector((state: any) => state.turfReducer);
  const dispatch = useDispatch();
  const hasShownAlert = useRef(false);
  const { locations } = useSelector((state: any) => state.locationsReducer); 

  const existingTurf = turfs.find((t: any) => t._id === tid);
  const existingLocations = locations || []; //pull the existing locations info
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

  // Check if user has permission
  useEffect(() => {
    if (currentUser && currentUser.role !== 'COURTOWNER' && !hasShownAlert.current) {
      hasShownAlert.current = true;
      window.alert("You do not have permission to create turfs");
      navigate(`/turfs`);
    }
  }, [currentUser, navigate]);

 

  //Fetching existing locations for selection
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
      
      const newTurf = await client.createTurf(turf); // Pass the whole turf object
      dispatch(addNewTurf(newTurf));
      window.alert("Turf created successfully!");
      navigate(`/profile`); // Navigate back to profile
    } catch (error) {
      console.error("Error saving turf:", error);
      window.alert("Error saving turf. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate(`/profile`); //navigate to profile page
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setTurf({ ...turf, amenities: [...turf.amenities, amenity] });
    } else {
      setTurf({ ...turf, amenities: turf.amenities.filter(a => a !== amenity) });
    }
  };
  const handleLocationChange = (locationId: string) => {
  setTurf({...turf, location: locationId})
}

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
    <div id="wd-turf-editor" className="p-4">
      <h2>Create New Turf</h2>
      <br />

      {/* Turf Name */}
      <FormLabel htmlFor="wd-turf-name">Turf Name</FormLabel>
      <FormControl 
        id="wd-turf-name" 
        value={turf.name}
        onChange={(e) => setTurf({ ...turf, name: e.target.value })}
        placeholder="Enter turf name"
      />
      <br />

      {/* Description */}
      <FormLabel htmlFor="wd-turf-description">Description</FormLabel>
      <FormControl 
        as="textarea"
        id="wd-turf-description"
        rows={5}
        value={turf.description}
        onChange={(e) => setTurf({ ...turf, description: e.target.value })}
        placeholder="Describe the turf facilities, surface type, etc."
      />
      <br />

      {/* Address */}
      <Row className="mb-3">
        <FormLabel htmlFor="wd-address" column sm={3}>
          Address
        </FormLabel>
        <Col sm={9}>
          <FormControl 
            id="wd-address" 
            value={turf.address}
            onChange={(e) => setTurf({ ...turf, address: e.target.value })}
            placeholder="123 Main St, City, State, ZIP"
          />
        </Col>
      </Row>

      {/* Price Per Hour */}
      <Row className="mb-3">
        <FormLabel htmlFor="wd-price" column sm={3}>
          Price Per Hour ($)
        </FormLabel>
        <Col sm={9}>
          <FormControl 
            type="number"
            id="wd-price" 
            value={turf.pricePerHour}
            onChange={(e) => setTurf({ ...turf, pricePerHour: Number(e.target.value) })}
            min="5"
            step="0.01"
          />
        </Col>
      </Row>

      {/* Operating Hours */}
      <Row className="mb-3">
        <FormLabel column sm={3}>
          Operating Hours
        </FormLabel>
        <Col sm={9}>
          <div className="border rounded p-3">
            <Row>
              <Col>
                <FormLabel htmlFor="wd-open-time">Open Time</FormLabel>
                <FormControl 
                  type="time"
                  id="wd-open-time" 
                  value={turf.openTime}
                  onChange={(e) => setTurf({ ...turf, openTime: e.target.value })}
                />
              </Col>
              <Col>
                <FormLabel htmlFor="wd-close-time">Close Time</FormLabel>
                <FormControl 
                  type="time"
                  id="wd-close-time" 
                  value={turf.closeTime}
                  onChange={(e) => setTurf({ ...turf, closeTime: e.target.value })}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* Amenities */}
      <Row className="mb-3">
        <FormLabel column sm={3}>
          Amenities
        </FormLabel>
        <Col sm={9}>
          <div className="border rounded p-3">
            {availableAmenities.map((amenity) => (
              <div key={amenity} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`amenity-${amenity}`}
                  checked={turf.amenities.includes(amenity)}
                  onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                />
                <label className="form-check-label" htmlFor={`amenity-${amenity}`}>
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </Col>
      </Row>

{/* Location*/}
<div className="d-flex justify-content-end gap-2 mt-4">
  <select 
    className="form-select"
    value={turf.location}
    onChange={(e) => handleLocationChange(e.target.value)}
  >
    <option value="">Select a location</option>
    {existingLocations.map((location:any) => (
      <option key={location._id} value={location._id}>
        {location.name}
      </option>
    ))}
  </select>
</div>
      {/* Action Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" size="lg" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="danger" size="lg" onClick={handleSave}>
           Create Turf
        </Button>
      </div>
    </div>
  );
}