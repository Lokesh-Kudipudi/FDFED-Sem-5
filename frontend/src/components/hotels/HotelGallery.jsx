const HotelGallery = ({ images }) => {
  return (
    <div className="-mt-16 relative z-30 max-w-7xl mx-auto px-4 md:px-8 mb-20 pointer-events-none">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pointer-events-auto">
          {images?.slice(0, 4).map((img, i) => (
             <div key={i} className="h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform transition-all hover:-translate-y-2 hover:shadow-orange-500/20 cursor-pointer">
                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
             </div>
          ))}
        </div>
    </div>
  );
};

export default HotelGallery;
