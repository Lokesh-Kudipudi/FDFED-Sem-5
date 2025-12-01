import { useState } from "react";
import { useNavigate } from "react-router";

export const useBooking = () => {
  const navigate = useNavigate();
  const [bookingStatus, setBookingStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const makeBooking = async (tourId, bookingDetails) => {
    setBookingStatus({
      loading: true,
      error: null,
      success: false,
    });

    try {
      const response = await fetch("http://localhost:5500/tours/booking", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourId,
          startDate: bookingDetails.startDate,
          endDate: bookingDetails.endDate,
        }),
      });

      const data = await response.json();

      if (data.status === "fail") {
        throw new Error(data.message);
      }

      setBookingStatus({
        loading: false,
        error: null,
        success: true,
      });
      navigate("/user/dashboard");
    } catch (error) {
      setBookingStatus({
        loading: false,
        error: error.message,
        success: false,
      });
    }
  };

  const bookHotel = async (hotelId, bookingDetails) => {
    setBookingStatus({
      loading: true,
      error: null,
      success: false,
    });

    try {
      const response = await fetch(
        `http://localhost:5500/hotels/booking/${hotelId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingDetails),
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        setBookingStatus({
          loading: false,
          error: null,
          success: true,
        });
        navigate("/user/dashboard");
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setBookingStatus({
        loading: false,
        error: err.message,
        success: false,
      });
    }
  };

  return { makeBooking, bookHotel, bookingStatus };
};
