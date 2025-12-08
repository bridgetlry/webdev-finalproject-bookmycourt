import { FaTrash } from "react-icons/fa";
export default function BookingControlButtons(
  { bookingId, deleteBooking }: { bookingId: string; deleteBooking: (bookingId: string) => void;} 
) {
  return (
    <div className="float-end">
      <FaTrash className="text-danger me-2 mb-1" onClick={() => deleteBooking(bookingId)}/>
    </div>
);
}