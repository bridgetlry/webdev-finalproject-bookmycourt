/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as client from "../client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../reducer";
import "../Account.css";
import "../../../index.css"
import MyBookings from "./MyBookings/MyBookings";
import Users from "./Users";
import { FaUser, FaSignOutAlt, FaEdit, FaPlus } from "react-icons/fa";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const HTTP_SERVER = import.meta.env.VITE_API_URL || "";

  const fetchProfile = () => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    setProfile(currentUser);
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/signin");
  };

  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
    setIsEditing(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser, navigate]);

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <FaUser />
            </div>
            <h1>{profile.firstName} {profile.lastName}</h1>
            <p className="profile-role">{profile.role === "COURTOWNER" ? "Court Owner" : profile.role === "CUSTOMER" ? "Customer" : "Admin"}</p>
          </div>

          {profile && (
            <div className="profile-content">
              <div className="profile-actions-top">
                <button
                  className="profile-edit-btn"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <FaEdit /> {isEditing ? "Cancel" : "Edit Profile"}
                </button>
                <button
                  className="profile-signout-btn"
                  onClick={signout}
                  id="wd-signout-btn"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>

              <div className="profile-form">
                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label htmlFor="wd-firstname">First Name</label>
                    <input
                      id="wd-firstname"
                      type="text"
                      className="profile-input"
                      value={profile.firstName || ""}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="profile-form-group">
                    <label htmlFor="wd-lastname">Last Name</label>
                    <input
                      id="wd-lastname"
                      type="text"
                      className="profile-input"
                      value={profile.lastName || ""}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label htmlFor="wd-username">Username</label>
                  <input
                    id="wd-username"
                    type="text"
                    className="profile-input"
                    value={profile.username || ""}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="wd-email">Email</label>
                  <input
                    id="wd-email"
                    type="email"
                    className="profile-input"
                    value={profile.email || ""}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="wd-password">Password</label>
                  <input
                    id="wd-password"
                    type="password"
                    className="profile-input"
                    value={profile.password || ""}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    disabled={!isEditing}
                    placeholder={isEditing ? "Enter new password" : "••••••••"}
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="wd-dob">Date of Birth</label>
                  <input
                    id="wd-dob"
                    type="date"
                    className="profile-input"
                    value={profile.dob || ""}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="wd-role">Role</label>
                  <select
                    id="wd-role"
                    className="profile-input"
                    value={profile.role || ""}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    disabled={!isEditing}
                  >
                    <option value="COURTOWNER">Court Owner</option>
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                {isEditing && (
                  <button onClick={updateProfile} className="profile-update-btn">
                    Save Changes
                  </button>
                )}
              </div>

              {currentUser && currentUser.role === "COURTOWNER" && (
                <div className="profile-actions-bottom">
                  <button
                    className="profile-create-turf-btn"
                    onClick={() => navigate(`/turfs/new`)}
                  >
                    <FaPlus /> Create New Turf
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {currentUser && currentUser.role === "CUSTOMER" && (
          <div className="profile-bookings-section">
            <MyBookings />
          </div>
        )}
        {currentUser && currentUser.role === "ADMIN" && (
          <div className="profile-users-section">
            <Users />
          </div>
        )}
      </div>
    </div>
  );
}
