import Header from "../../components/Header";
import Footer from "../../components/Footer";
import HeroSection from "../../components/tours/HeroSection";
import Destinations from "../../components/tours/Destinations";

const ToursIndex = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Header />
      <Destinations />
      <Footer />
    </div>
  );
};

export default ToursIndex;
