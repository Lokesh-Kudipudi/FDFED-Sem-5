// components/PlacesToVisit.jsx
const PlacesToVisit = ({ destinations }) => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold">Places to Visit</h2>
      <div className="flex mt-4">
        {destinations.map((destination, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-[225px]"
          >
            <img
              src={destination.image}
              alt={destination.name}
              className="w-[200px] h-[250px] object-cover rounded-2xl"
            />
            <h3 className="mt-2 font-semibold">
              {destination.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlacesToVisit;
