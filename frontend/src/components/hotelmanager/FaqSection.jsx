import React from 'react';
import { FaQuestionCircle, FaPlus, FaMinus } from "react-icons/fa";

export default function FaqSection({ isEditing, formData, setFormData, hotel, onFaqChange }) {
    
  const addFaq = () => {
    setFormData((prev) => ({ ...prev, faq: [...(prev.faq || []), { question: "", answer: "" }] }));
  };

  const removeFaq = (index) => {
    const newFaq = [...(formData.faq || [])];
    newFaq.splice(index, 1);
    setFormData((prev) => ({ ...prev, faq: newFaq }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-yellow-500">
          <FaQuestionCircle />
          <h3 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h3>
        </div>
        {isEditing && (
          <button onClick={addFaq} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium">
            <FaPlus /> Add Question
          </button>
        )}
      </div>

      <div className="space-y-4">
        {isEditing ? (
          formData.faq?.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
              <button 
                onClick={() => removeFaq(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaMinus />
              </button>
              <input
                type="text"
                placeholder="Question"
                value={item.question}
                onChange={(e) => onFaqChange(index, "question", e.target.value)}
                className="w-full bg-transparent border-b border-gray-300 mb-2 pb-1 text-gray-900 focus:outline-none focus:border-indigo-500 font-medium"
              />
              <textarea
                placeholder="Answer"
                value={item.answer}
                onChange={(e) => onFaqChange(index, "answer", e.target.value)}
                rows="2"
                className="w-full bg-transparent text-gray-600 text-sm focus:outline-none"
              />
            </div>
          ))
        ) : (
          <div className="space-y-4">
            {hotel.faq?.map((item, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                <h4 className="font-medium text-gray-900 mb-1">{item.question}</h4>
                <p className="text-gray-600 text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
