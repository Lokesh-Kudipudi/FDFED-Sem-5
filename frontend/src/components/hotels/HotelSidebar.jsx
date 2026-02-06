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
           

       </div>
    </div>
  );
};

export default HotelSidebar;
