import axios from "axios";
const axiosWithCredentials =
  axios.create({ withCredentials: true });
  
const HTTP_SERVER = import.meta.env.VITE_API_URL || "http://localhost:4000";
const TURFS_API = `${HTTP_SERVER}/api/turfs`;
export const USERS_API = `${HTTP_SERVER}/api/users`;

export const fetchAllTurfs = async () => {
  const { data } = await axiosWithCredentials.get(TURFS_API);
  return data;
};

export const fetchAllBookings = async (userId: string) => {
  const response = await axiosWithCredentials.get(
    `${HTTP_SERVER}/api/users/${userId}/bookings`);
  return response.data;
} 

export const bookTurf = async (userId: string, turfId: string, date: string, time: string) => {
    console.log("Booking:", userId, turfId, date, time);
    const response = await axiosWithCredentials.post(`${TURFS_API}/${turfId}/bookings/${userId}`, { date, time });
    console.log("Booking response:", response.data);
    return response.data
}

export const addReview = async (turfId: string, review: { rating: number, comment: string }) => {
  const response = await axiosWithCredentials.post(
    `${HTTP_SERVER}/api/turfs/${turfId}/reviews`, 
    review
  );
  return response.data;
};

export const deleteReview = async (turfId: string, reviewId: string) => {
  const response = await axiosWithCredentials.delete(
    `${HTTP_SERVER}/api/turfs/${turfId}/reviews/${reviewId}`
  );
  return response.data;
};

// ============ FAVORITES ============

export const addFavorite = async (userId: string, turfId: string) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/${userId}/favorites/${turfId}`
  );
  return response.data;
};

export const removeFavorite = async (userId: string, turfId: string) => {
  const response = await axiosWithCredentials.delete(
    `${USERS_API}/${userId}/favorites/${turfId}`
  );
  return response.data;
};

export const getFavorites = async (userId: string) => {
  const response = await axiosWithCredentials.get(
    `${USERS_API}/${userId}/favorites`
  );
  return response.data;
};

export const checkIsFavorite = async (userId: string, turfId: string) => {
  const response = await axiosWithCredentials.get(
    `${USERS_API}/${userId}/favorites/${turfId}/check`
  );
  return response.data.isFavorite;
};

export const findPublicUserById = async (userId: string) => {
  const response = await axios.get(`${USERS_API}/${userId}/public`);
  return response.data;
};


