import React from 'react';
import { FaTimesCircle } from "react-icons/fa";

export default function AssignRoomModal({ 
    isOpen, 
    booking, 
    rooms, 
    selectedRoomId, 
    onSelectRoom, 
    onConfirm, 
    onClose 
}) {
    if (!isOpen || !booking) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
                <div className="bg-[#003366] p-6 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold">Assign Room</h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full"><FaTimesCircle /></button>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-2">Booking for <span className="font-bold text-gray-900">{booking.bookingDetails?.roomType}</span></p>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-xs font-bold text-gray-400 uppercase">Guest</p>
                            <p className="font-bold text-gray-800">{booking.userId?.fullName}</p>
                        </div>
                    </div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Available Room</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {rooms.filter(r => 
                            (r.status === 'available' || r._id === booking.assignedRoomId) && 
                            (!booking.bookingDetails?.roomType || r.roomType === booking.bookingDetails.roomType)
                        ).length === 0 ? (
                            <p className="text-red-500 text-sm text-center py-4">No available rooms match this type.</p>
                        ) : (
                            rooms.filter(r => 
                                (r.status === 'available' || r._id === booking.assignedRoomId) && 
                                (!booking.bookingDetails?.roomType || r.roomType === booking.bookingDetails.roomType)
                            ).map(room => (
                                <div 
                                    key={room._id}
                                    onClick={() => onSelectRoom(room._id)}
                                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedRoomId === room._id ? "border-[#003366] bg-blue-50" : "border-gray-100 hover:border-gray-300"}`}
                                >
                                    <div>
                                        <span className="font-bold text-gray-900">Room {room.roomNumber}</span>
                                        <p className="text-xs text-gray-500">Floor {room.floorNumber || "G"}</p>
                                    </div>
                                    {room._id === booking.assignedRoomId && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Current</span>}
                                </div>
                            ))
                        )}
                    </div>

                     <div className="mt-8 flex gap-3">
                        <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold">Cancel</button>
                        <button onClick={onConfirm} className="flex-1 bg-[#003366] text-white py-3 rounded-xl font-bold hover:bg-blue-900 shadow-lg" disabled={!selectedRoomId}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
