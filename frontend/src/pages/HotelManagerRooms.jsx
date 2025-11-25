import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../components/dashboard/shared/DashboardLayout";
import { hotelManagerSidebarItems } from "../components/dashboard/hotelManager/hotelManagerSidebarItems.jsx";
import toast from "react-hot-toast";

export default function HotelManagerRooms({ initialRoom = null, onSave }) {
  // Form state
  const defaultRoom = {
    title: "",
    roomNumber: "",
    type: "single", // single | double | suite
    price: "",
    capacity: 1,
    amenities: [], // array of strings
    description: "",
    images: [], // File objects
  };

  const [room, setRoom] = useState(initialRoom ? structuredClone(initialRoom) : defaultRoom);
  const fileInputRef = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]); // { id, url, file }
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // generate previews when room.images change
    const previews = (room.images || []).map((file, idx) => ({
      id: `${file.name}-${file.size}-${idx}-${Date.now()}`,
      url: URL.createObjectURL(file),
      file,
    }));
    setImagePreviews(previews);

    // cleanup object URLs on unmount or when images change
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.images]);

  // Helpers: safe structured clone for simple objects (browser supported)
  function structuredCloneSafe(obj) {
    try {
      return structuredClone(obj);
    } catch {
      return JSON.parse(JSON.stringify(obj));
    }
  }

  // File handlers
  function handleFilesSelected(filesList) {
    const files = Array.from(filesList).filter((f) => f && f.type && f.type.startsWith("image/"));
    if (!files.length) {
      toast.error("Please select image files (jpg/png/webp).");
      return;
    }
    setRoom((r) => {
      const next = structuredCloneSafe(r);
      next.images = [...(next.images || []), ...files];
      return next;
    });
  }

  function handleRemovePreview(previewId) {
    setRoom((r) => {
      const next = structuredCloneSafe(r);
      const keep = imagePreviews.filter((p) => p.id !== previewId).map((p) => p.file);
      next.images = keep;
      return next;
    });
  }

  // Drag & drop
  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }
  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }
  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length) {
      handleFilesSelected(e.dataTransfer.files);
    }
  }

  // Form inputs
  function setField(field, value) {
    setRoom((r) => {
      const next = structuredCloneSafe(r);
      next[field] = value;
      return next;
    });
  }

  // Amenity helper (comma-separated input)
  function setAmenitiesFromString(str) {
    const arr = str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setField("amenities", arr);
  }

  // Validation
  function validate() {
    if (!room.title || room.title.trim().length < 3) {
      toast.error("Room title must be at least 3 characters.");
      return false;
    }
    if (!room.roomNumber || room.roomNumber.trim() === "") {
      toast.error("Room number is required.");
      return false;
    }
    const price = parseFloat(room.price);
    if (Number.isNaN(price) || price < 0) {
      toast.error("Price must be a non-negative number.");
      return false;
    }
    const cap = parseInt(room.capacity, 10);
    if (Number.isNaN(cap) || cap < 1) {
      toast.error("Capacity must be at least 1.");
      return false;
    }
    return true;
  }

  // Submit
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      // Build payload (files are present in room.images)
      // If you want to upload, create FormData and append fields + files.
      // Here we just call the onSave callback if provided.
      const payload = structuredCloneSafe(room);
      if (onSave) {
        await onSave(payload); // allow async
      } else {
        // Simulate a network save
        await new Promise((res) => setTimeout(res, 600));
      }
      toast.success("Room saved successfully.");
      // reset after save
      setRoom(defaultRoom);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      toast.error("Failed to save room.");
    } finally {
      setSubmitting(false);
    }
  }

  // Reset
  function handleReset() {
    setRoom(defaultRoom);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast("Form reset.");
  }

  return (
    <DashboardLayout title="Room Inventory" sidebarItems={hotelManagerSidebarItems}>
      <div className="p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Room</h1>
            <p className="text-gray-500 mt-1">Create a new room listing for your hotel.</p>
          </div>
        </header>

        <section className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">New Room Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Title</label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  value={room.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="e.g., Deluxe Sea View"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  value={room.roomNumber}
                  onChange={(e) => setField("roomNumber", e.target.value)}
                  placeholder="e.g., 101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  value={room.type}
                  onChange={(e) => setField("type", e.target.value)}
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  value={room.capacity}
                  onChange={(e) => setField("capacity", Math.max(1, parseInt(e.target.value || "1", 10)))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  value={room.price}
                  onChange={(e) => setField("price", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities (comma separated)</label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  value={(room.amenities || []).join(", ")}
                  onChange={(e) => setAmenitiesFromString(e.target.value)}
                  placeholder="WiFi, Breakfast, Parking"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                rows={5}
                value={room.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            {/* Image upload area */}
            <div
              onDragEnter={handleDragEnter}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-6 border-2 ${dragActive ? "border-dashed border-indigo-500 bg-indigo-50" : "border-dashed border-gray-300 bg-gray-50"} rounded-lg p-6 text-center transition-colors`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="text-gray-600">Drag & drop images here, or</div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Choose Images
                </button>
                <div className="text-sm text-gray-500">Recommended: JPG / PNG / WEBP — multiple allowed</div>
              </div>
            </div>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imagePreviews.map((p) => (
                  <div key={p.id} className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={p.url} alt="preview" className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePreview(p.id)}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Form buttons */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors font-medium"
                >
                  {submitting ? "Saving..." : "Save Room"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Reset
                </button>
              </div>

              <div className="text-sm text-gray-500 hidden sm:block">You can add images and detailed info for the room.</div>
            </div>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}