import React, { useState, useEffect } from 'react';
import { FaTimes, FaUserCheck, FaSearch } from 'react-icons/fa';
import { API } from '../../config/api';

const AssignEmployeeModal = ({ isOpen, onClose, onAssign, entityName, entityType, isLoading }) => {
    const [employees, setEmployees] = useState([]);
    const [fetchingEmployees, setFetchingEmployees] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
        }
    }, [isOpen]);

    const fetchEmployees = async () => {
        setFetchingEmployees(true);
        try {
            const response = await fetch(API.ADMIN.EMPLOYEES, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error("Failed to fetch employees");
            const data = await response.json();
            setEmployees(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setFetchingEmployees(false);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedEmployeeId) {
            onAssign(selectedEmployeeId);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
                <div className="bg-[#003366] p-6 flex justify-between items-center text-white">
                    <div className="flex flex-col">
                        <h3 className="font-bold text-xl">Assign Employee</h3>
                        <p className="text-blue-100 text-xs mt-1">Assigning to: <span className="font-bold text-white">{entityName}</span></p>
                    </div>
                    <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20"><FaTimes /></button>
                </div>

                <div className="p-8">
                    <div className="relative mb-6">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search employees by name or email..."
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-[#003366] outline-none transition-all"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {fetchingEmployees ? (
                                <div className="text-center py-8">
                                    <div className="w-8 h-8 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin mx-auto"></div>
                                    <p className="text-sm text-gray-500 mt-2">Loading employees...</p>
                                </div>
                            ) : filteredEmployees.length > 0 ? (
                                filteredEmployees.map((emp) => (
                                    <label
                                        key={emp._id}
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedEmployeeId === emp._id
                                                ? 'border-[#003366] bg-blue-50'
                                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="employee"
                                            value={emp._id}
                                            checked={selectedEmployeeId === emp._id}
                                            onChange={() => setSelectedEmployeeId(emp._id)}
                                            className="w-5 h-5 accent-[#003366]"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate">{emp.fullName}</p>
                                            <p className="text-xs text-gray-500 truncate">{emp.email}</p>
                                        </div>
                                    </label>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No employees found.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isLoading || !selectedEmployeeId}
                                className="flex-1 bg-[#003366] text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <FaUserCheck /> {isLoading ? 'Assigning...' : 'Assign Employee'}
                            </button>
                            <button type="button" onClick={onClose} className="px-6 py-4 border-2 border-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssignEmployeeModal;
