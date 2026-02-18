import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import { useEffect, useState } from "react";
import HeroSection from "../components/home/HeroSection";
import ServicesSection from "../components/home/ServicesSection";
import ItinerarySection from "../components/home/ItinerarySection";
import FAQSection from "../components/home/FAQSection";
import { API } from "../config/api";
import toast from "react-hot-toast";

export default function Home() {
  const [randomHotels, setRandomHotels] = useState([]);

  useEffect(() => {
    fetch(API.HOTELS.LIST)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const shuffled = data.data.sort(() => 0.5 - Math.random());
          setRandomHotels(shuffled.slice(0, 3));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch hotels", err);
        toast.error(err.message);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <HeroSection />

      <ServicesSection />

      <ItinerarySection randomHotels={randomHotels} />

      <FAQSection />

      <Footer />

      <Chatbot />
    </div>
  );
}
