import { useState } from "react";

export const useBooking = () => {
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
      const response = await fetch(
        "http://localhost:5500/tours/booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tourId,
            startDate: bookingDetails.startDate,
            endDate: bookingDetails.endDate,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "fail") {
        throw new Error(data.message);
      }

      setBookingStatus({
        loading: false,
        error: null,
        success: true,
      });
      window.location.href = "/dashboard/myTrips";
    } catch (error) {
      setBookingStatus({
        loading: false,
        error: error.message,
        success: false,
      });
    }
  };

  return { makeBooking, bookingStatus };
};
