const AboutSection = () => {
  return (
    <section className="mx-auto my-16 flex max-w-[85vw] bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="relative w-2/5">
        <img
          src="https://images.pexels.com/photos/22614625/pexels-photo-22614625/free-photo-of-idyllic-beach-on-bangaram-island-in-india.jpeg"
          alt="Beach"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-5 left-4 bg-amber-400 text-white p-4 rounded-lg text-center">
          <span className="text-3xl font-bold block">5+</span>
          <span className="text-sm">years of experience</span>
        </div>
      </div>
      <div className="w-3/5 p-8">
        <h3 className="text-amber-400 text-sm font-semibold">
          ABOUT US
        </h3>
        <h1 className="text-2xl text-gray-900 font-bold my-2">
          Chasing Horizons
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Chasing Horizons is a premier tourism and hotel booking
          site, dedicated to providing unforgettable travel
          experiences. Established in 2020, we have been trusted
          by countless travelers to plan and book their perfect
          getaways.
        </p>
        <ul className="mt-2 space-y-1">
          <li className="text-sm text-gray-700">
            ✔ Travel Packages
          </li>
          <li className="text-sm text-gray-700">✔ Hotels</li>
        </ul>
        <a
          href="/tours/search"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-semibold"
        >
          Discover More →
        </a>
      </div>
    </section>
  );
};

export default AboutSection;
