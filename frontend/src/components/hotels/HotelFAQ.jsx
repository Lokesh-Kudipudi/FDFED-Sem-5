const HotelFAQ = ({ faq, activeFaq, toggleFaq }) => {
  return (
    <section id="faq" className="scroll-mt-40">
       <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Common Questions</h2>
       <div className="space-y-4">
          {faq?.map((item, i) => (
            <div key={i} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${activeFaq === i ? "bg-white shadow-lg border-gray-100" : "bg-transparent border-gray-200"}`}>
               <button onClick={() => toggleFaq(i)} className="w-full flex justify-between items-center p-6 text-left font-bold text-gray-800 hover:text-[#003366]">
                  {item.question}
                  <span className={`transition-transform duration-300 ${activeFaq === i ? "rotate-180" : ""}`}>▼</span>
               </button>
               <div className={`px-6 text-gray-600 overflow-hidden transition-all duration-300 ${activeFaq === i ? "max-h-40 pb-6" : "max-h-0"}`}>
                  {item.answer}
               </div>
            </div>
          ))}
       </div>
    </section>
  );
};

export default HotelFAQ;
