import { useNavigate } from "react-router";

const destinations = [
  {
    name: "Rajasthan",
    image:
      "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvZnJpbmRpYV9jb2tlX3B1ZXJ0YV9tZXJsaW5fMC1pbWFnZS1reWJkZmpqci5qcGc.jpg",
    packages: 1,
    span: 2,
  },
  {
    name: "Shimla",
    image:
      "https://live.staticflickr.com/7289/10991694376_40a1f41791_b.jpg",
    packages: 1,
  },
  {
    name: "Goa",
    image:
      "https://images.rawpixel.com/image_social_landscape/cHJpdmF0ZS9zdGF0aWMvaW1hZ2Uvd2Vic2l0ZS8yMDIyLTA0L2xyL2ZydGhhaWxhbmRfcGh1a2V0X2tvaF9waGlfOC1pbWFnZS1reWJhaDJpYi5qcGc.jpg",
    packages: 1,
  },
  {
    name: "Kashmir",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTDtqVgKil3J5sQeg_u8xU5FhfXJ52zEps9Q&s",
    packages: 1,
  },
  {
    name: "Varanasi",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9_VDxOBv8Q1u3yjsZO6aUgbFsaEXL0cb6NA&s",
    packages: 1,
  },
  {
    name: "Kerala",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIbadu9m2jEZPw8VwMwbViQlXerMZ_TTc-hg&s",
    packages: 1,
    span: 2,
  },
  /* Commented out in original but can be added if needed:
  {
    name: 'West Bengal',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Naulakha_gate%2Cranthambor_fort.jpg',
    packages: 5
  },
  {
    name: 'Tamil Nadu',
    image: 'https://www.worldhistory.org/uploads/images/4127.jpg',
    packages: 5
  },
  {
    name: 'Himachal Pradesh',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaWtgI18oOyQCJpoOIoLuQAbPGYrgT1QkoAQ&s',
    packages: 6
  }
  */
];

const Destinations = () => {
  const navigate = useNavigate();
  return (
    <section className="py-10 px-5 text-center">
      <h3 className="text-amber-500 font-semibold text-sm">
        DESTINATIONS
      </h3>
      <h1 className="text-2xl text-gray-900 font-bold my-2">
        TOP DESTINATIONS
      </h1>
      <p className="text-sm text-gray-600 max-w-xl mx-auto mb-5">
        Discover India's enchanting destinations, from the
        tranquil seas to majestic mountains. With Chasing
        Horizons.
      </p>

      <div className="grid grid-cols-4 gap-4 max-w-[900px] mx-auto">
        {destinations.map((dest, index) => (
          <div
            key={index}
            className={`relative rounded-lg overflow-hidden bg-cover bg-center h-[200px] flex items-end transition-transform hover:scale-105 ${
              dest.span ? `grid-col-span-${dest.span}` : ""
            }`}
            style={{ backgroundImage: `url('${dest.image}')` }}
          >
            <div
              className="bg-black/50 text-white p-3 w-full text-left cursor-pointer"
              onClick={() =>
                navigate(`/tours/search?q=${dest.name}`)
              }
            >
              <h2 className="text-base mb-1 hover:text-blue-500">
                {dest.name}
              </h2>
              <p className="text-xs">
                {dest.packages} Tour Packages
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Destinations;
