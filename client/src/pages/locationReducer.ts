import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  locations: [],
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    addNewLocation: (state, { payload: location }) => {
      const newLocation = { ...location, _id: uuidv4() };
      state.locations = [...state.locations, newLocation] as any;
    },
    deleteLocation: (state, { payload: locationId }) => {
      state.locations = state.locations.filter(
        (location: any) => location._id !== locationId
      );
    },
    updateLocation: (state, { payload: location }) => {
      state.locations = state.locations.map((l: any) =>
        l._id === location._id ? location : l
      ) as any;
    },

    
    
    setLocations: (state, { payload: locations }) => {
      state.locations = locations;
    },

  },
});
export const { addNewLocation, deleteLocation, updateLocation, setLocations } =
  locationsSlice.actions;
export default locationsSlice.reducer;