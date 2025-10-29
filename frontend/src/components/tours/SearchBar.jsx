const SearchBar = ({ onSearch }) => {
  return (
    <div className="max-w-4xl mx-auto my-5 px-4">
      <div className="flex items-center bg-white p-3 rounded-full shadow-lg">
        <span className="text-xl mr-3">📍</span>
        <div className="flex-1">
          <label
            htmlFor="location"
            className="block text-sm font-semibold"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            placeholder="Where are you going?"
            className="w-full border-none focus:outline-none text-base"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
