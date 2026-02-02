import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Tour from "../../components/tours/Tour";

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(
          `http://localhost:5500/tours/tour/${id}`
        );
        if (!response.ok) {
          throw new Error("Tour not found");
        }
        const data = await response.json();
        console.log(data);
        setTour(data.tour);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return <Tour tour={tour} />;
};

export default TourDetail;
