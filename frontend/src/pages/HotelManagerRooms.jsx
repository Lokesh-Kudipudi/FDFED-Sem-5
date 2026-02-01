import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTimes, FaEdit, FaStar, FaImage, FaTrash, FaBed, FaLayerGroup, FaSortNumericDown, FaRupeeSign, FaInfoCircle } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/shared/DashboardLayout";
import { hotelManagerSidebarItems } from "../components/dashboard/hotelManager/hotelManagerSidebarItems.jsx";
import toast from "react-hot-toast";

export default function HotelManagerRooms() {
  const [activeTab, setActiveTab] = useState("physical"); // 'types' or 'physical'
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [roomTypes, setRoomTypes] = useState([]);
  const [physicalRooms, setPhysicalRooms] = useState([]);
  const [hotelId, setHotelId] = useState(null);

  // Room Type Form State
  const [editingTypeId, setEditingTypeId] = useState(null);
  const defaultType = { title: "", price: "", rating: 4.5, features: [], image: "", description: "" };
  const [typeForm, setTypeForm] = useState(defaultType);
  const [submittingType, setSubmittingType] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Physical Room Form State
  const [editingRoomId, setEditingRoomId] = useState(null);
  const defaultRoom = { roomNumber: "", roomTypeId: "", floorNumber: "", price: "", status: "available" };
  const [roomForm, setRoomForm] = useState(defaultRoom);
  const [submittingRoom, setSubmittingRoom] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      setLoading(true);
      // Fetch Hotel Data (Room Types)
      const hotelRes = await fetch("http://localhost:5500/hotels/my-hotel", { credentials: "include" });
      const hotelData = await hotelRes.json();
      
      if (hotelData.status === "success" && hotelData.data) {
        setRoomTypes(hotelData.data.roomType || []);
        setHotelId(hotelData.data._id);
        
        // Fetch Physical Rooms
        fetchPhysicalRooms();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPhysicalRooms() {
    try {
      const res = await fetch("http://localhost:5500/hotels/rooms", { credentials: "include" });
      const data = await res.json();
      if (data.status === "success") {
        setPhysicalRooms(data.data);
      }
    } catch (error) {
        console.error("Error fetching rooms:", error);
    }
  }

  // --- ROOM TYPE FUNCTIONS ---
  function setTypeField(field, value) {
    setTypeForm((prev) => ({ ...prev, [field]: value }));
  }

  function setFeaturesFromString(str) {
    const arr = str.split(",").map((s) => s.trim()).filter(Boolean);
    setTypeField("features", arr);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  async function handleTypeSubmit(e) {
    e.preventDefault();
    if (!typeForm.title || !typeForm.price) return toast.error("Title and Price are required");
    
    setSubmittingType(true);
    try {
      let url = "http://localhost:5500/hotels/room-type";
      let method = "POST";
      if (editingTypeId) {
        url = `http://localhost:5500/hotels/room-type/${editingTypeId}`;
        method = "PUT";
      }

      const formData = new FormData();
      formData.append("title", typeForm.title);
      formData.append("price", typeForm.price);
      formData.append("rating", typeForm.rating);
      formData.append("description", typeForm.description);
      formData.append("features", (typeForm.features || []).join(","));
      if (selectedFile) formData.append("image", selectedFile);
      else if (typeForm.image) formData.append("image", typeForm.image);

      const response = await fetch(url, { method, credentials: "include", body: formData });
      const data = await response.json();

      if (data.status === "success") {
        toast.success(editingTypeId ? "Room Type updated" : "Room Type added");
        fetchInitialData(); // Reload all
        resetTypeForm();
      } else {
        toast.error(data.message || "Failed.");
      }
    } catch (err) {
      toast.error("Error saving room type.");
    } finally {
      setSubmittingType(false);
    }
  }

  async function checkDeleteRoomType(typeId) {
      if (!window.confirm("Delete this room type?")) return;
        try {
        const response = await fetch(`http://localhost:5500/hotels/room-type/${typeId}`, {
            method: "DELETE",
            credentials: "include",
        });
        const data = await response.json();
        if (data.status === "success") {
            toast.success("Room type deleted");
            fetchInitialData();
        } else {
            toast.error(data.message);
        }
    } catch (error) { toast.error("Error deleting room type"); }
  }

  function editType(t) {
      setTypeForm({
          title: t.title,
          price: t.price,
          rating: t.rating,
          features: t.features,
          image: t.image,
          description: t.description
      });
      setEditingTypeId(t._id);
      setImagePreview(t.image);
      setSelectedFile(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetTypeForm() {
      setTypeForm(defaultType);
      setEditingTypeId(null);
      setSelectedFile(null);
      setImagePreview("");
  }


  // --- PHYSICAL ROOM FUNCTIONS ---
  function setRoomField(field, value) {
    setRoomForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRoomSubmit(e) {
      e.preventDefault();
      if(!roomForm.roomNumber || !roomForm.roomTypeId) return toast.error("Room Number and Type are required");

      setSubmittingRoom(true);
      try {
        // Find room type name for snapshot
        const selectedType = roomTypes.find(t => t._id === roomForm.roomTypeId);
        const payload = {
            ...roomForm,
            roomType: selectedType ? selectedType.title : ""
        };

        let url = "http://localhost:5500/hotels/room";
        let method = "POST";
        if (editingRoomId) {
            url = `http://localhost:5500/hotels/room/${editingRoomId}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (data.status === "success") {
            toast.success(editingRoomId ? "Room updated" : "Room created");
            fetchPhysicalRooms();
            closeRoomModal();
        } else {
            toast.error(data.message || "Failed");
        }
      } catch (err) {
          toast.error("Error processing room");
      } finally {
          setSubmittingRoom(false);
      }
  }

  async function checkDeleteRoom(roomId) {
      if(!window.confirm("Delete this physical room?")) return;
      try {
          const response = await fetch(`http://localhost:5500/hotels/room/${roomId}`, {
              method: "DELETE",
              credentials: "include"
          });
          const data = await response.json();
          if (data.status === "success") {
              toast.success("Room deleted");
              fetchPhysicalRooms();
          } else {
              toast.error(data.message);
          }
      } catch (err) { toast.error("Error deleting room"); }
  }

  function editRoom(r) {
      setRoomForm({
          roomNumber: r.roomNumber,
          roomTypeId: r.roomTypeId,
          floorNumber: r.floorNumber || "",
          price: r.price || "",
          status: r.status
      });
      setEditingRoomId(r._id);
      setShowRoomModal(true);
  }

  function closeRoomModal() {
      setShowRoomModal(false);
      setRoomForm(defaultRoom);
      setEditingRoomId(null);
  }

  if (loading) {
    return (
      <DashboardLayout title="Room Inventory" sidebarItems={hotelManagerSidebarItems}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Room Inventory" sidebarItems={hotelManagerSidebarItems}>
      <div className="p-8 space-y-8 animate-fade-in relative">
        
        {/* Header & Tabs */}
        <div className="border-b border-gray-100 pb-0">
          <div className="flex justify-between items-end mb-4">
              <div>
                <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2 flex items-center gap-3">
                    <span className="bg-blue-50 p-2 rounded-xl text-3xl">🛏️</span> Room Inventory
                </h1>
                <p className="text-gray-500 text-lg">Manage room types and individual units.</p>
              </div>
          </div>
          <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab("physical")}
                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-4 transition-all ${activeTab === "physical" ? "border-[#003366] text-[#003366]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                  Physical Rooms
              </button>
              <button 
                onClick={() => setActiveTab("types")}
                className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-4 transition-all ${activeTab === "types" ? "border-[#003366] text-[#003366]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                  Room Types
              </button>
          </div>
        </div>

        {/* --- PHYSICAL ROOMS TAB --- */}
        {activeTab === "physical" && (
            <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">All Rooms ({physicalRooms.length})</h2>
                    <button 
                        onClick={() => setShowRoomModal(true)}
                        className="bg-[#003366] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-900 transition-all flex items-center gap-2"
                    >
                        <FaPlus /> Add Room
                    </button>
                </div>

                {/* Rooms Grid/Table */}
                {physicalRooms.length === 0 ? (
                    <div className="bg-gray-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🔑</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No physical rooms found</h3>
                        <p className="text-gray-500 mb-6">Add rooms to generate inventory for bookings.</p>
                        <button onClick={() => setShowRoomModal(true)} className="text-[#003366] font-bold hover:underline">Create your first room</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {physicalRooms.map(room => {
                            const rType = roomTypes.find(t => t._id === room.roomTypeId);
                            const statusColors = {
                                "available": "bg-green-100 text-green-700",
                                "occupied": "bg-blue-100 text-blue-700",
                                "maintenance": "bg-red-100 text-red-700"
                            };

                            return (
                                <div key={room._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all relative group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-xl text-gray-800">
                                            {room.roomNumber}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[room.status] || "bg-gray-100"}`}>
                                            {room.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400 flex items-center gap-2"><FaLayerGroup /> Type</span>
                                            <span className="font-bold text-gray-700">{rType?.title || room.roomType || "Unknown"}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400 flex items-center gap-2"><FaSortNumericDown /> Floor</span>
                                            <span className="font-bold text-gray-700">{room.floorNumber || "G"}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400 flex items-center gap-2"><FaRupeeSign /> Price</span>
                                            <span className="font-bold text-gray-700">{room.price ? `₹${room.price}` : "Standard"}</span>
                                        </div>
                                        {room.currentBookingId && (
                                            <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-gray-100">
                                                <span className="text-blue-500 font-bold flex items-center gap-2"><FaInfoCircle /> Occupied</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => editRoom(room)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl font-bold text-sm transition-colors">Edit</button>
                                        <button onClick={() => checkDeleteRoom(room._id)} className="px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-colors"><FaTrash /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}

        {/* --- ROOM TYPES TAB --- */}
        {activeTab === "types" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <section className="lg:col-span-1">
                <form onSubmit={handleTypeSubmit} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 sticky top-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{editingTypeId ? "Edit Type" : "Add Room Type"}</h3>
                    <div className="space-y-4">
                        <input className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-[#003366]" placeholder="Title" value={typeForm.title} onChange={e=>setTypeField("title", e.target.value)} />
                        <input className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-[#003366]" type="number" placeholder="Price" value={typeForm.price} onChange={e=>setTypeField("price", e.target.value)} />
                        <textarea className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-[#003366]" placeholder="Description" rows="3" value={typeForm.description} onChange={e=>setTypeField("description", e.target.value)} />
                        <input className="w-full border p-3 rounded-xl outline-none focus:ring-2 ring-[#003366]" placeholder="Features (comma separated)" value={(typeForm.features||[]).join(",")} onChange={e=>setFeaturesFromString(e.target.value)} />
                        
                        {/* Image Upload Simplified */}
                         <div className="relative">
                            <label className="block w-full border-2 border-dashed border-gray-300 p-4 rounded-xl text-center cursor-pointer hover:bg-gray-50">
                                <input type="file" className="hidden" onChange={handleFileChange} />
                                {selectedFile ? selectedFile.name : "Upload Image"}
                            </label>
                            {imagePreview && <img src={imagePreview} className="mt-2 h-32 w-full object-cover rounded-xl" alt="Preview"/>}
                        </div>

                        <div className="flex gap-2">
                             <button type="submit" disabled={submittingType} className="flex-1 bg-[#003366] text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition-all">{submittingType ? "Saving..." : "Save Type"}</button>
                             {editingTypeId && <button type="button" onClick={resetTypeForm} className="px-4 bg-gray-200 rounded-xl font-bold text-gray-600">Cancel</button>}
                        </div>
                    </div>
                </form>
              </section>

              <section className="lg:col-span-2 space-y-6">
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
                             <button onClick={()=>editType(t)} className="p-2 bg-blue-50 text-[#003366] rounded-lg hover:bg-blue-100"><FaEdit /></button>
                             <button onClick={()=>checkDeleteRoomType(t._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><FaTrash /></button>
                         </div>
                     </div>
                 ))}
              </section>
            </div>
        )}

        {/* --- PHYSICAL ROOM MODAL --- */}
        {showRoomModal && (
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
        )}

      </div>
    </DashboardLayout>
  );
}