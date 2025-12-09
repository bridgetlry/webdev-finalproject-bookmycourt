/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import * as client from "./client";
import "./Account.css";
import "../../index.css"


export default function Signin() {
 const [credentials, setCredentials] = useState<any>({});
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const signin = async () => {
   const user = await client.signin(credentials);
   if (!user) return;
   dispatch(setCurrentUser(user));
   navigate("/profile");
 };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to BookMyCourt</p>
        </div>
        <div className="auth-form">
          <div className="form-group">
            <label htmlFor="wd-username">Username</label>
            <input
              type="text"
              id="wd-username"
              className="auth-input"
              placeholder="Enter your username"
              value={credentials.username || ""}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="wd-password">Password</label>
            <input
              type="password"
              id="wd-password"
              className="auth-input"
              placeholder="Enter your password"
              value={credentials.password || ""}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>
          <button onClick={signin} id="wd-signin-btn" className="auth-button">
            Sign In
          </button>
          <div className="auth-footer">
            <p>Don't have an account? <Link id="wd-signup-link" to="/signup">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
