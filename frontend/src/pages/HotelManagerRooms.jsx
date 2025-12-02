import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/dashboard/shared/DashboardLayout";
import { hotelManagerSidebarItems } from "../components/dashboard/hotelManager/hotelManagerSidebarItems.jsx";
import toast from "react-hot-toast";

export default function HotelManagerRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoomId, setEditingRoomId] = useState(null);

  // Form state
  const defaultRoom = {
    title: "",
    price: "",
    rating: 4.5,
    features: [], // array of strings
    image: "", // URL string
    description: "", // Keeping description as it's in the model
  };

  const [room, setRoom] = useState(defaultRoom);
  const [submitting, setSubmitting] = useState(false);

  // Fetch hotel and rooms on mount
  useEffect(() => {
    fetchHotelData();
  }, []);

  async function fetchHotelData() {
    try {
      setLoading(true);
      // Using fetch instead of axios
      const response = await fetch("http://localhost:5500/hotels/my-hotel", {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch hotel data");
      }

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

  // Form inputs
  function setField(field, value) {
    setRoom((prev) => ({ ...prev, [field]: value }));
  }

  // Features helper (comma-separated input)
  function setFeaturesFromString(str) {
    const arr = str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("features", arr);
  }

  // Validation
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
    if (!room.image || room.image.trim() === "") {
        toast.error("Image URL is required.");
        return false;
    }
    return true;
  }

  // Submit
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

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(room),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        toast.success(editingRoomId ? "Room updated successfully." : "Room added successfully.");
        fetchHotelData(); // Refresh list
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

  // Edit handler
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Reset
  function handleReset() {
    setRoom(defaultRoom);
    setEditingRoomId(null);
  }

  return (
    <DashboardLayout title="Room Inventory" sidebarItems={hotelManagerSidebarItems}>
      <div className="p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Room Inventory</h1>
            <p className="text-gray-500 mt-1">Manage your hotel's room types.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <section className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {editingRoomId ? "Edit Room" : "Add New Room"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Title</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    value={room.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="e.g., Deluxe Sea View"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    value={room.price}
                    onChange={(e) => setField("price", e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    disabled
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
                    value={room.rating}
                    onChange={(e) => setField("rating", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    value={(room.features || []).join(", ")}
                    onChange={(e) => setFeaturesFromString(e.target.value)}
                    placeholder="WiFi, Balcony, AC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    value={room.image}
                    onChange={(e) => setField("image", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                 {room.image && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                        <img src={room.image} alt="Preview" className="w-full h-32 object-cover" onError={(e) => e.target.style.display = 'none'} onLoad={(e) => e.target.style.display = 'block'} />
                    </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors font-medium"
                >
                  {submitting ? "Saving..." : (editingRoomId ? "Update Room" : "Add Room")}
                </button>
                {editingRoomId && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* List Section */}
          <section className="lg:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Existing Rooms</h2>
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading rooms...</div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                No rooms added yet. Use the form to add your first room.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((r) => (
                  <div key={r._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div className="h-48 bg-gray-200 relative">
                        {r.image ? (
                             <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-sm font-semibold text-gray-900">
                        ₹{r.price}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{r.title}</h3>
                        <div className="flex items-center text-yellow-500 text-sm font-medium">
                          <span>★</span>
                          <span className="ml-1 text-gray-700">{r.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {r.features && r.features.slice(0, 3).map((f, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {f}
                          </span>
                        ))}
                        {r.features && r.features.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{r.features.length - 3} more
                            </span>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => handleEdit(r)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                          Edit Room
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}