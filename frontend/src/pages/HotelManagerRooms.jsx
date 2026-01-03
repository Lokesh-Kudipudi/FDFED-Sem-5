import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTimes, FaEdit, FaStar, FaImage, FaTrash } from "react-icons/fa";
import DashboardLayout from "../components/dashboard/shared/DashboardLayout";
import { hotelManagerSidebarItems } from "../components/dashboard/hotelManager/hotelManagerSidebarItems.jsx";
import toast from "react-hot-toast";

export default function HotelManagerRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoomId, setEditingRoomId] = useState(null);

  const defaultRoom = {
    title: "",
    price: "",
    rating: 4.5,
    features: [],
    image: "",
    description: "",
  };

  const [room, setRoom] = useState(defaultRoom);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHotelData();
  }, []);

  async function fetchHotelData() {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5500/hotels/my-hotel", {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) throw new Error("Failed to fetch hotel data");

      const data = await response.json();
      if (data.status === "success" && data.data) {
        setRooms(data.data.roomType || []);
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      toast.error("Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  }

  function setField(field, value) {
    setRoom((prev) => ({ ...prev, [field]: value }));
  }

  function setFeaturesFromString(str) {
    const arr = str.split(",").map((s) => s.trim()).filter(Boolean);
    setField("features", arr);
  }

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function validate() {
    if (!room.title || room.title.trim().length < 3) {
      toast.error("Room title must be at least 3 characters.");
      return false;
    }
    const price = parseFloat(room.price);
    if (Number.isNaN(price) || price < 0) {
      toast.error("Price must be a non-negative number.");
      return false;
    }
    const rating = parseFloat(room.rating);
    if (Number.isNaN(rating) || rating < 0 || rating > 5) {
      toast.error("Rating must be between 0 and 5.");
      return false;
    }
    if (!selectedFile && (!room.image || room.image.trim() === "")) {
      toast.error("Image is required.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      let url = "http://localhost:5500/hotels/room-type";
      let method = "POST";

      if (editingRoomId) {
        url = `http://localhost:5500/hotels/room-type/${editingRoomId}`;
        method = "PUT";
      }

      const formData = new FormData();
      formData.append("title", room.title);
      formData.append("price", room.price);
      formData.append("rating", room.rating);
      formData.append("description", room.description);
      
      // Handle features (send as string or separate fields)
      // Sending as comma-separated string which backend parses is safest for mixed text/file forms
      const featuresString = (room.features || []).join(",");
      formData.append("features", featuresString);

      // Handle Image
      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (room.image) {
        formData.append("image", room.image); // Send existing URL if no new file
      }

      const response = await fetch(url, {
        method: method,
        credentials: "include",
        body: formData, // No Content-Type header, let browser set boundary
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        toast.success(editingRoomId ? "Room updated successfully." : "Room added successfully.");
        fetchHotelData();
        handleReset();
      } else {
        toast.error(data.message || "Failed to save room.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save room.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(roomId) {
    if (!window.confirm("Are you sure you want to delete this room type?")) return;
    
    try {
      const response = await fetch(`http://localhost:5500/hotels/room-type/${roomId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      
      if (response.ok && data.status === "success") {
        toast.success("Room deleted successfully.");
        fetchHotelData();
      } else {
        toast.error(data.message || "Failed to delete room.");
      }
    } catch (error) {
       console.error(error);
       toast.error("Failed to delete room.");
    }
  }

  function handleEdit(r) {
    setRoom({
      title: r.title || "",
      price: r.price || "",
      rating: r.rating || 4.5,
      features: r.features || [],
      image: r.image || "",
      description: r.description || "",
    });
    setEditingRoomId(r._id);
    setImagePreview(r.image || ""); // Show existing image
    setSelectedFile(null); // Reset new file
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleReset() {
    setRoom(defaultRoom);
    setEditingRoomId(null);
    setSelectedFile(null);
    setImagePreview("");
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
      <div className="p-8 space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2 flex items-center gap-3">
            <span className="bg-blue-50 p-2 rounded-xl text-3xl">🛏️</span> Room Inventory
          </h1>
          <p className="text-gray-500 text-lg">Manage your hotel's room types and pricing.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section */}
          <section className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                {editingRoomId ? "Edit Room" : "Add New Room"}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Room Title *</label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all"
                    value={room.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="e.g., Deluxe Sea View"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Price (INR) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all"
                    value={room.price}
                    onChange={(e) => setField("price", e.target.value)}
                    placeholder="₹0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaStar className="text-yellow-500" /> Rating (0-5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    disabled
                    className="w-full border-2 border-gray-200 rounded-xl p-4 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                    value={room.rating}
                  />
                  <p className="text-xs text-gray-400 mt-1">Rating is auto-calculated from guest reviews</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Features (comma separated)</label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all"
                    value={(room.features || []).join(", ")}
                    onChange={(e) => setFeaturesFromString(e.target.value)}
                    placeholder="WiFi, Balcony, AC, TV"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaImage className="text-[#003366]" /> Room Image *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="room-image-upload"
                    />
                    <label 
                      htmlFor="room-image-upload"
                      className="w-full block border-2 border-dashed border-[#003366] bg-blue-50 text-[#003366] rounded-xl p-4 text-center cursor-pointer hover:bg-blue-100 transition-all font-bold"
                    >
                      {selectedFile ? selectedFile.name : (editingRoomId ? "Change Image" : "Upload Image")}
                    </label>
                  </div>
                  
                  {(imagePreview || room.image) && (
                    <div className="mt-3 rounded-xl overflow-hidden border-2 border-gray-200 relative group">
                      <img 
                        src={imagePreview || room.image} 
                        alt="Preview" 
                        className="w-full h-40 object-cover" 
                        onError={(e) => e.target.style.display = 'none'} 
                      />
                       {selectedFile && (
                          <button 
                            type="button"
                            onClick={() => { setSelectedFile(null); setImagePreview(room.image || ""); }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTimes size={12} />
                          </button>
                       )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-4 bg-[#003366] text-white rounded-xl hover:bg-blue-900 disabled:opacity-60 transition-all font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <FaSave /> {submitting ? "Saving..." : (editingRoomId ? "Update Room" : "Add Room")}
                </button>
                {(editingRoomId || selectedFile || room.title) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-bold flex items-center gap-2"
                  >
                    <FaTimes /> Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* List Section */}
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Existing Rooms ({rooms.length})</h2>
            {rooms.length === 0 ? (
              <div className="bg-gray-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🛏️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No rooms added yet</h3>
                <p className="text-gray-500">Use the form to add your first room type.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rooms.map((r, idx) => {
                  if (!r) return null;
                  return (
                  <div 
                    key={r._id || idx} 
                    className="bg-white rounded-[2rem] shadow-lg shadow-gray-200/40 border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group animate-slide-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      {r.image ? (
                        <img 
                          src={r.image} 
                          alt={r.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">📸</div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg">
                        <span className="text-lg font-bold text-[#003366]">₹{r.price}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-xl shadow-lg flex items-center gap-1">
                        <FaStar className="text-yellow-500" size={14} />
                        <span className="text-sm font-bold text-gray-900">{r.rating}</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-xl mb-3">{r.title}</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {r.features && r.features.slice(0, 3).map((f, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-[#003366] text-xs rounded-full font-medium border border-blue-100">
                            {f}
                          </span>
                        ))}
                        {r.features && r.features.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{r.features.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleEdit(r)}
                          className="flex-1 bg-[#003366] text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-900 transition-all flex items-center justify-center gap-2"
                        >
                          <FaEdit /> Edit
                        </button>
                         <button
                          onClick={() => handleDelete(r._id)}
                          className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}