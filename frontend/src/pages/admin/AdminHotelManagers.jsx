import React, { useState, useEffect } from "react";
import { FaHotel, FaPlus, FaTrash, FaSearch, FaEnvelope, FaPhone, FaTimes, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/dashboard/shared/DashboardLayout";
import { adminSidebarItems } from "../../components/dashboard/admin/adminSidebarItems";

const HotelManagers = () => {
  const [hotelManagers, setHotelManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchHotelManagers();
  }, []);

  const fetchHotelManagers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5500/admin/users/hotel-managers", {
        credentials: "include",
      });
      const data = await response.json();
      
      if (data.status === "success") {
        setHotelManagers(data.data);
      } else {
        toast.error("Failed to load hotel managers");
      }
    } catch (error) {
      console.error("Error fetching hotel managers:", error);
      toast.error("Error loading hotel managers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5500/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, role: "hotelManager" }),
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        toast.success("Hotel manager created successfully!");
        setShowCreateModal(false);
        setFormData({ fullName: "", email: "", password: "", phone: "", address: "" });
        fetchHotelManagers();
      } else {
        toast.error(data.message || "Failed to create hotel manager");
      }
    } catch (error) {
      console.error("Error creating hotel manager:", error);
      toast.error("Error creating hotel manager");
    }
  };

  const handleDelete = async () => {
    if (!selectedManager) return;
    
    try {
      const response = await fetch(`http://localhost:5500/admin/users/${selectedManager._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        toast.success("Hotel manager deleted successfully!");
        setShowDeleteModal(false);
        setSelectedManager(null);
        fetchHotelManagers();
      } else {
        toast.error(data.message || "Failed to delete hotel manager");
      }
    } catch (error) {
      console.error("Error deleting hotel manager:", error);
      toast.error("Error deleting hotel manager");
    }
  };

  const filteredManagers = hotelManagers.filter(manager =>
    manager.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Hotel Managers Management" sidebarItems={adminSidebarItems}>
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#003366] mb-3 flex items-center gap-3">
            <span className="bg-blue-50 p-2 rounded-xl text-3xl">🏨</span> Hotel Managers
          </h1>
          <p className="text-gray-500 text-lg">Manage hotel manager accounts and permissions.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#003366] text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-900 hover:scale-105 transition-all flex items-center gap-2"
        >
          <FaPlus /> Add Hotel Manager
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Managers</div>
          <div className="text-4xl font-bold text-[#003366]">{hotelManagers.length}</div>
        </div>
        <div className="bg-gradient-to-br from-[#003366] to-[#0055aa] p-6 rounded-[2rem] shadow-xl shadow-blue-900/20 text-white">
          <div className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Active</div>
          <div className="text-4xl font-bold">{hotelManagers.length}</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Search Results</div>
          <div className="text-4xl font-bold text-gray-800">{filteredManagers.length}</div>
        </div>
      </div>

      {/* Hotel Managers Grid */}
      {filteredManagers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredManagers.map((manager, idx) => (
            <div
              key={manager._id}
              className="bg-white rounded-[2rem] p-6 shadow-lg shadow-gray-200/40 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#003366] to-[#0055aa] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {manager.fullName?.charAt(0)?.toUpperCase() || "H"}
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all" onClick={() => { setSelectedManager(manager); setShowDeleteModal(true); }}>
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">{manager.fullName}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-2 mb-2"><FaEnvelope className="text-blue-400" /> {manager.email}</p>
              {manager.phone && <p className="text-sm text-gray-500 flex items-center gap-2 mb-3"><FaPhone className="text-blue-400" /> {manager.phone}</p>}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold">
                  Hotel Manager
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No hotel managers found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or add a new hotel manager.</p>
        </div>
      )}

      {/* Modals - Same as TourGuides */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-[#003366] p-6 flex justify-between items-center text-white">
              <h3 className="font-bold text-xl">Create Hotel Manager</h3>
              <button onClick={() => setShowCreateModal(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20"><FaTimes /></button>
            </div>
            
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none resize-none"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-[#003366] text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg flex items-center justify-center gap-2">
                  <FaSave /> Create Manager
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && selectedManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-red-600 p-6 text-white">
              <h3 className="font-bold text-xl flex items-center gap-2"><FaTrash /> Confirm Deletion</h3>
            </div>
            
            <div className="p-8 space-y-6">
              <p className="text-gray-700">
                Are you sure you want to delete <strong>{selectedManager.fullName}</strong>? This action cannot be undone.
              </p>
              
              <div className="flex gap-4">
                <button onClick={handleDelete} className="flex-1 bg-red-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg">
                  Delete
                </button>
                <button onClick={() => { setShowDeleteModal(false); setSelectedManager(null); }} className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default HotelManagers;
