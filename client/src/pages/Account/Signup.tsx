/* eslint-disable @typescript-eslint/no-explicit-any */
import * as client from "./client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import "./Account.css";
import "../../index.css"

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signup = async () => {
    const currentUser = await client.signup(user);
    dispatch(setCurrentUser(currentUser));
    navigate("/profile");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join BookMyCourt today</p>
        </div>
        <div className="auth-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              className="auth-input"
              placeholder="Enter your first name"
              value={user.firstName || ""}
              onChange={(e) => setUser({
                ...user,
                firstName: e.target.value
              })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              className="auth-input"
              placeholder="Enter your last name"
              value={user.lastName || ""}
              onChange={(e) => setUser({
                ...user,
                lastName: e.target.value
              })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="auth-input"
              placeholder="Choose a username"
              value={user.username || ""}
              onChange={(e) => setUser({
                ...user,
                username: e.target.value
              })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="auth-input"
              placeholder="Create a password"
              value={user.password || ""}
              onChange={(e) => setUser({
                ...user,
                password: e.target.value
              })}
            />
          </div>
          <button className="auth-button" onClick={signup}>Create Account</button>
          <div className="auth-footer">
            <p>Already have an account? <Link to="/signin">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}