import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./pages/Account/reducer";
import turfReducer from "./pages/reducer";
import bookingsReducer from "./pages/Account/Profile/MyBookings/reducer";
import locationsReducer from "./pages/locationReducer";

const store = configureStore({
  reducer: {
    accountReducer,
    turfReducer,
    bookingsReducer,
    locationsReducer,
  },
});

export default store;