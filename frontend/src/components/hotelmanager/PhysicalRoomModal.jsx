import React from 'react';
import { FaTimes } from "react-icons/fa";

export default function PhysicalRoomModal({ 
    showRoomModal, 
    closeRoomModal, 
    editingRoomId, 
    handleRoomSubmit, 
    roomForm, 
    setRoomField, 
    submittingRoom, 
    roomTypes 
}) {
  if (!showRoomModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
        <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{editingRoomId ? "Edit Room" : "Add New Room"}</h2>
                <button onClick={closeRoomModal} className="p-2 hover:bg-gray-100 rounded-full"><FaTimes /></button>
            </div>
            <form onSubmit={handleRoomSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Room Number *</label>
                        <input className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-[#003366]" value={roomForm.roomNumber} onChange={e=>setRoomField("roomNumber", e.target.value)} placeholder="101" />
                        </div>
                        <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Floor</label>
                        <input className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-[#003366]" value={roomForm.floorNumber} onChange={e=>setRoomField("floorNumber", e.target.value)} placeholder="1" type="number" />
                        </div>
                </div>
                
                <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Room Type *</label>
                        <select className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-[#003366]" value={roomForm.roomTypeId} onChange={e=>setRoomField("roomTypeId", e.target.value)}>
                            <option value="">Select Type</option>
                            {roomTypes.map(t => <option key={t._id} value={t._id}>{t.title} - ₹{t.price}</option>)}
                        </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                    <select className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-[#003366]" value={roomForm.status} onChange={e=>setRoomField("status", e.target.value)}>
                        <option value="available">Available</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="occupied" disabled>Occupied (Set via Booking)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Override Price (Optional)</label>
                    <input className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-[#003366]" type="number" value={roomForm.price} onChange={e=>setRoomField("price", e.target.value)} placeholder="Leave empty to use type price" />
                </div>

                <button type="submit" disabled={submittingRoom} className="w-full bg-[#003366] text-white py-4 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg mt-4">
                    {submittingRoom ? "Saving..." : "Save Room"}
                </button>
            </form>
        </div>
    </div>
  );
}
