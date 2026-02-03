import { FaInfoCircle } from "react-icons/fa";

const HotelPolicies = ({ policies }) => {
  return (
    <section id="policies" className="scroll-mt-40 bg-stone-50 p-10 rounded-3xl border border-stone-100">
      <h2 className="text-2xl font-bold text-stone-800 mb-6 font-serif">Property Policies</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {policies?.map((p, i) => (
           <li key={i} className="flex gap-4 text-stone-600 items-start">
             <FaInfoCircle className="mt-1 flex-shrink-0 text-stone-400" />
             <span className="text-sm leading-relaxed">{p}</span>
           </li>
         ))}
      </ul>
   </section>
  );
};

export default HotelPolicies;
