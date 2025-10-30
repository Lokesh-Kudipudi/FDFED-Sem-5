// RecommendationPage.jsx
import React, { useEffect, useState } from "react";
import TourCard from "../components/tours/TourCard";
import Header from "../components/Header"; // assuming you have this
import Footer from "../components/Footer"; // assuming you have this

const RecommendationPage = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5500/recommendation"
        );
        const { data } = await response.json();
        setTours(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative flex justify-center">
        <div className="absolute top-0 z-10 w-[90%]">
          <Header />
        </div>
      </div>

      <section className="flex-grow mx-auto max-w-[900px] mt-24">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Recommended Tours
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RecommendationPage;
