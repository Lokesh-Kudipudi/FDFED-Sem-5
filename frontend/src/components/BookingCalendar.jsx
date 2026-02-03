import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const BookingCalendar = ({ bookedDates = [], onChange, initialStartDate, initialEndDate }) => {
  // Helper to parse YYYY-MM-DD to Local Midnight safely
  const parseIdxDate = (dateInput) => {
      if (!dateInput) return null;
      // If it's already a Date object
      if (dateInput instanceof Date) {
          const d = new Date(dateInput);
          d.setHours(0,0,0,0);
          return d;
      }
      // If string YYYY-MM-DD
      if (typeof dateInput === "string" && dateInput.includes("-")) {
          const [y, m, d] = dateInput.split('-').map(Number);
          return new Date(y, m - 1, d);
      }
      return new Date(dateInput); // Fallback
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Use helper for initial state
  const [startDate, setStartDate] = useState(parseIdxDate(initialStartDate));
  const [endDate, setEndDate] = useState(parseIdxDate(initialEndDate));

  useEffect(() => {
    if (initialStartDate !== undefined) setStartDate(parseIdxDate(initialStartDate));
    if (initialEndDate !== undefined) setEndDate(parseIdxDate(initialEndDate));
  }, [initialStartDate, initialEndDate]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const traverseMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isDateBooked = (date) => {
    // date is Local Midnight
    // bookedDates are strings YYYY-MM-DD
    // Compare YYYY-MM-DD strings
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return bookedDates.includes(dateString);
  };

  const isDateDisabled = (date) => {
      const today = new Date();
      today.setHours(0,0,0,0);
      return date < today || isDateBooked(date);
  };

  const handleDateClick = (day) => {
    // Create Local Date
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (isDateDisabled(clickedDate)) return;

    // Normalize comparison values
    const startMs = startDate ? startDate.getTime() : 0;
    const _endMs = endDate ? endDate.getTime() : 0;
    const clickedMs = clickedDate.getTime();

    // Reset loop if both selected
    if (startDate && endDate) {
      setStartDate(clickedDate);
      setEndDate(null);
      onChange(clickedDate, null);
      return;
    }

    // Determine start or end
    if (!startDate || (startDate && clickedMs < startMs)) {
      setStartDate(clickedDate);
      onChange(clickedDate, endDate);
    } else if (startDate && !endDate) {
        // Check if any range in between is booked
        let invalidRange = false;
        // Iterate day by day from startDate to clickedDate (exclusive of start?)
        // Actually we check every day in range
        for (let d = new Date(startDate); d <= clickedDate; d.setDate(d.getDate() + 1)) {
            if (isDateBooked(d)) {
                invalidRange = true;
                break;
            }
        }
        
        if (invalidRange) {
             // Reset to just the new date because range is invalid
             setStartDate(clickedDate);
             setEndDate(null);
             onChange(clickedDate, null);
        } else {
             setEndDate(clickedDate);
             onChange(startDate, clickedDate);
        }
    }
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      // date is already local midnight by constructor definition
      
      const isDisabled = isDateDisabled(date);
      const isBooked = isDateBooked(date);
      
      let isSelected = false;
      let isInRange = false;

      // Safe MS comparison
      const dateMs = date.getTime();
      const startMs = startDate ? startDate.getTime() : -1;
      const endMs = endDate ? endDate.getTime() : -1;

      if (startMs !== -1 && dateMs === startMs) isSelected = true;
      if (endMs !== -1 && dateMs === endMs) isSelected = true;
      if (startMs !== -1 && endMs !== -1 && dateMs > startMs && dateMs < endMs) isInRange = true;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isDisabled}
          className={`
            p-2 w-full aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all relative
            ${isDisabled ? "text-gray-300 bg-gray-50 cursor-not-allowed" : "hover:bg-blue-50 text-gray-700"}
            ${isSelected ? "bg-[#003366] text-white hover:bg-[#003366] shadow-md z-10" : ""}
            ${isInRange ? "bg-blue-50 text-[#003366] rounded-none" : ""}
            ${isBooked ? "bg-red-50 text-red-300 decoration-red-300 line-through" : ""}
          `}
        >
          {day}
          {isBooked && <div className="absolute w-1 h-1 bg-red-300 rounded-full bottom-1"></div>}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-lg text-gray-800 font-serif">
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h4>
        <div className="flex gap-2">
            <button onClick={() => traverseMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FaChevronLeft size={12} /></button>
            <button onClick={() => traverseMonth(1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FaChevronRight size={12} /></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
      
      <div className="flex items-center gap-4 mt-6 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full border border-gray-200 bg-white"></div> Available</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-50 border border-red-100"></div> Booked</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#003366]"></div> Selected</div>
      </div>
    </div>
  );
};

export default BookingCalendar;
