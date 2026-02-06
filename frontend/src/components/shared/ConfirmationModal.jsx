import React from 'react';
import { FaExclamationTriangle, FaTrash, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger': return <FaTrash />;
      case 'warning': return <FaExclamationTriangle />;
      case 'info': return <FaInfoCircle />;
      default: return <FaExclamationTriangle />;
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case 'danger': return 'bg-red-600';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-600';
      default: return 'bg-red-600';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'danger': return 'bg-red-600 hover:bg-red-700';
      case 'warning': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'info': return 'bg-blue-600 hover:bg-blue-700';
      default: return 'bg-red-600 hover:bg-red-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
        <div className={`${getHeaderColor()} p-6 text-white flex justify-between items-center`}>
          <h3 className="font-bold text-xl flex items-center gap-2">
            {getIcon()} {title}
          </h3>
          <button 
            onClick={onClose} 
            className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <p className="text-gray-700 text-lg">
            {message}
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={onConfirm} 
              className={`flex-1 ${getButtonColor()} text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg transform hover:scale-[1.02] active:scale-[0.98]`}
            >
              {confirmText}
            </button>
            <button 
              onClick={onClose} 
              className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
