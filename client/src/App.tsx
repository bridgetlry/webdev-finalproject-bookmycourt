import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Contact } from "./pages/Contact/Contact";
import Account from "./pages/Account/Account";
import Map from "./pages/Map";
import "./index.css";
import Signin from "./pages/Account/Signin";
import Signup from "./pages/Account/Signup";
import Profile from "./pages/Account/Profile/Profile";
import TurfDetails from './pages/TurfDetails';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as client from './pages/Account/client';
import { setCurrentUser } from './pages/Account/reducer';
import Turfs from "./pages/Account/Profile/Turfs";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await client.profile();
        dispatch(setCurrentUser(user));
      } catch (error) {
        console.log('No active session');
      }
    };
    fetchProfile();
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/map" element={<Map />} />
        <Route path="/turf/:id" element={<TurfDetails />} />
        <Route path="/turfs/new" element={<Turfs />} />
        <Route path="/turfs/:tid" element={<Turfs />} />
      </Routes>
    </Router>
  );
}
export default App;
