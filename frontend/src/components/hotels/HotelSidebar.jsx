const HotelSidebar = ({ features }) => {
  return (
    <div className="lg:col-span-4 hidden lg:block">
       <div className="sticky top-40 space-y-8">
           <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif border-b border-gray-100 pb-4">Highlights</h3>
              <div className="space-y-6">
                 {features && Object.entries(features).slice(0, 3).map(([key, items]) => (
                   <div key={key}>
                      <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-2">{key}</h4>
                      <ul className="space-y-2">
                        {items.slice(0, 2).map((it, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                            <div className="w-1.5 h-1.5 bg-[#003366] rounded-full"></div> {it}
                          </li>
                        ))}
                      </ul>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2698&auto=format&fit=crop" alt="Adv" className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-[#003366]/80 flex flex-col justify-center items-center text-center p-8 text-white">
                 <h3 className="font-serif text-2xl font-bold mb-2">Private Concierge</h3>
                 <p className="text-sm text-white/70 mb-6">Need special arrangements? We are here to help.</p>
                 <button className="bg-white text-[#003366] px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors w-full">Chat Now</button>
              </div>
           </div>
       </div>
    </div>
  );
};

export default HotelSidebar;
