import React from 'react';
import { FaEdit, FaTrash } from "react-icons/fa";

export default function RoomTypeList({ roomTypes, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
        {roomTypes.map(t => (
            <div key={t._id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex gap-4 items-center">
                <img src={t.image} alt={t.title} className="w-24 h-24 rounded-2xl object-cover bg-gray-100" />
                <div className="flex-1">
                    <h4 className="font-bold text-lg">{t.title}</h4>
                    <p className="text-[#003366] font-bold">₹{t.price}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                        {t.features.slice(0,3).map((f,i)=><span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-500">{f}</span>)}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <button onClick={()=>onEdit(t)} className="p-2 bg-blue-50 text-[#003366] rounded-lg hover:bg-blue-100"><FaEdit /></button>
                    <button onClick={()=>onDelete(t._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><FaTrash /></button>
                </div>
            </div>
        ))}
    </div>
  );
}
