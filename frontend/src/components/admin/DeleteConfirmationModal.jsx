import React from 'react';
import { FaTrash, FaTimes } from 'react-icons/fa';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
        <div className="bg-red-600 p-6 text-white flex justify-between items-center">
          <h3 className="font-bold text-xl flex items-center gap-2"><FaTrash /> Confirm Deletion</h3>
          <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20"><FaTimes /></button>
        </div>
        
        <div className="p-8 space-y-6">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
          </p>
          
          <div className="flex gap-4">
            <button onClick={onConfirm} className="flex-1 bg-red-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg">
              Delete
            </button>
            <button onClick={onClose} className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
