import { useState } from "react";

const HeroSection = () => {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    window.location.href =
      inputValue.length === 0
        ? `/tours/search`
        : `/tours/search?q=${inputValue}`;
  };

  return (
    <section className="relative w-screen h-screen overflow-hidden flex justify-center items-center">
      <div className="absolute top-0 left-0 w-full h-full">
        <video
          className="w-screen h-screen object-cover filter brightness-30"
          autoPlay
          muted
        >
          <source
            src="/videos/tours/toursBg.mp4"
            type="video/mp4"
          />
          Your browser does not support video tag
        </video>
      </div>
      <div className="relative z-10 flex justify-center items-center flex-col">
        <h1 className="text-white text-5xl font-bold shadow-lg">
          Its Time to Chase Horizons.
        </h1>
        <h3 className="text-gray-400 w-full text-right">
          Let's plan your journey to the horizon.
        </h3>
        <div className="mt-5 w-full flex justify-center items-center">
          <div className="flex items-center bg-white p-3 rounded-full shadow-lg w-[500px] max-w-[90%]">
            <span className="text-2xl mr-2">📍</span>
            <div className="flex flex-col flex-1">
              <label
                htmlFor="location"
                className="text-sm font-bold"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                placeholder="Where are you going?"
                className="border-none outline-none text-base py-1 bg-transparent"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-base cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
