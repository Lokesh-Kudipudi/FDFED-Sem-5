import React from 'react';
import { FaBan } from "react-icons/fa";

export default function CancelBookingModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-6 text-center animate-slide-up">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBan size={30} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Booking?</h3>
                <p className="text-gray-500 mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                
                <div className="flex gap-3">
                     <button 
                         onClick={onClose} 
                         className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                     >
                        No, Keep
                     </button>
                     <button 
                         onClick={onConfirm} 
                         className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg transition-all"
                     >
                        Yes, Cancel
                     </button>
                </div>
            </div>
        </div>
    );
}
