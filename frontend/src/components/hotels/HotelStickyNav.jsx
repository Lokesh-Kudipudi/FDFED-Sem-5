const HotelStickyNav = ({ activeSection, setActiveSection }) => {
  return (
    <div className="sticky top-20 z-35 bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100 mb-12">
       <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between py-4">
           <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {["Overview", "Amenities", "Rooms", "Policies", "FAQ"].map((section) => (
                <a 
                  key={section} 
                  href={`#${section.toLowerCase()}`}
                  onClick={(e) => { e.preventDefault(); setActiveSection(section.toLowerCase()); document.getElementById(section.toLowerCase())?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className={`text-sm font-bold uppercase tracking-widest transition-all ${activeSection === section.toLowerCase() ? "text-[#003366] border-b-2 border-[#003366]" : "text-gray-400 hover:text-gray-900"}`}
                >
                  {section}
                </a>
              ))}
          </div>
          <div className="hidden md:block">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Luxury Stay</span>
          </div>
       </div>
    </div>
  );
};

export default HotelStickyNav;
