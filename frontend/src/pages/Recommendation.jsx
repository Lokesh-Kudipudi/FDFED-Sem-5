// RecommendationPage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRecommendations } from "../redux/slices/recommendationSlice";
import TourCard from "../components/tours/TourCard";
import HotelCard from "../components/hotels/HotelCard";
import Header from "../components/Header"; 
import Footer from "../components/Footer"; 
import { API } from "../config/api";

const RecommendationPage = () => {
  const dispatch = useDispatch();
  const { tours, hotels } = useSelector((state) => state.recommendation);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          API.RECOMMENDATION
        );
        const data = await response.json();

        dispatch(setRecommendations({
          tours: data?.data?.tours?.data || [],
          hotels: data?.data?.hotels?.data || []
        }));
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative flex justify-center">
        <div className="absolute top-0 z-10 w-[90%]">
          <Header />
        </div>
      </div>

      <section className="flex-grow mx-auto max-w-[900px] mt-24 mb-12">
        {tours.length > 0 && (
          <>
            <h1 className="text-3xl font-bold mb-8 text-center">
              Recommended Tours
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {tours.map((tour) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
          </>
        )}

        {hotels.length > 0 && (
          <>
            <h1 className="text-3xl font-bold mb-8 text-center">
              Recommended Hotels
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default RecommendationPage;
