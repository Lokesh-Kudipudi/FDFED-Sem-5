import React, { useState, useRef, useEffect } from "react";

/**
 * HotelManagerRoomsAdd.jsx
 *
 * Single-file React component (Tailwind CSS) that replicates the Rooms Add UI/behavior.
 * - Sidebar with collapse toggle
 * - Room Add form (fields, validation)
 * - Drag & drop / file input for images with preview & remove
 * - Toast notifications
 *
 * Usage:
 *  <HotelManagerRoomsAdd initialRoom={...} onSave={(room) => console.log(room)} />
 *
 * Notes:
 * - Tailwind CSS must be configured in your project.
 * - No external icons required; uses simple text / emoji for small UI affordances.
 */

export default function HotelManagerRoomsAdd({ initialRoom = null, onSave }) {
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  // Toasts
  const [toasts, setToasts] = useState([]); // { id, text, type }

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

  function pushToast(text, type = "info") {
    const id = Date.now() + Math.random();
    setToasts((s) => [...s, { id, text, type }]);
    setTimeout(() => {
      setToasts((s) => s.filter((t) => t.id !== id));
    }, 3000);
  }

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
      pushToast("Please select image files (jpg/png/webp).", "error");
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
      pushToast("Room title must be at least 3 characters.", "error");
      return false;
    }
    if (!room.roomNumber || room.roomNumber.trim() === "") {
      pushToast("Room number is required.", "error");
      return false;
    }
    const price = parseFloat(room.price);
    if (Number.isNaN(price) || price < 0) {
      pushToast("Price must be a non-negative number.", "error");
      return false;
    }
    const cap = parseInt(room.capacity, 10);
    if (Number.isNaN(cap) || cap < 1) {
      pushToast("Capacity must be at least 1.", "error");
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
      pushToast("Room saved successfully.", "success");
      // reset after save
      setRoom(defaultRoom);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      pushToast("Failed to save room.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  // Reset
  function handleReset() {
    setRoom(defaultRoom);
    if (fileInputRef.current) fileInputRef.current.value = "";
    pushToast("Form reset.", "info");
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* Toaster */}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow-md text-sm ${
              t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-indigo-600"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className={`w-64 bg-slate-800 p-4 transition-transform duration-300 ${sidebarCollapsed ? "-translate-x-64" : "translate-x-0"}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-purple-400">Chasing Horizons</h2>
            <div className="text-sm text-pink-300">Hotel Manager</div>
          </div>
          <button
            aria-label="Toggle sidebar"
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="px-2 py-1 bg-white/10 rounded hover:bg-white/20"
          >
            ☰
          </button>
        </div>

        <nav className="space-y-2">
          <a className="block px-3 py-2 rounded bg-slate-700 hover:bg-slate-600">Dashboard</a>
          <a className="block px-3 py-2 rounded bg-slate-700 hover:bg-slate-600">Bookings</a>
          <a className="block px-3 py-2 rounded bg-slate-700 hover:bg-slate-600">Rooms</a>
          <a className="block px-3 py-2 rounded bg-slate-700 hover:bg-slate-600">Settings</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Add Room</h1>
            <p className="text-gray-400 mt-1">Create a new room listing for your hotel.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-800 px-3 py-2 rounded">
              <span className="text-sm text-gray-300">Search</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">HM</div>
          </div>
        </header>

        <section className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="rooms-add-form-container bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-medium mb-4 add-room-heading">New Room</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Room Title</label>
                <input
                  className="w-full px-3 py-2 rounded bg-gray-50 text-black"
                  value={room.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="e.g., Deluxe Sea View"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Room Number</label>
                <input
                  className="w-full px-3 py-2 rounded bg-gray-50 text-black"
                  value={room.roomNumber}
                  onChange={(e) => setField("roomNumber", e.target.value)}
                  placeholder="e.g., 101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Type</label>
                <select
                  className="w-full px-3 py-2 rounded bg-gray-50 text-black"
                  value={room.type}
                  onChange={(e) => setField("type", e.target.value)}
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Capacity</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 rounded bg-gray-50 text-black"
                  value={room.capacity}
                  onChange={(e) => setField("capacity", Math.max(1, parseInt(e.target.value || "1", 10)))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Price (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 rounded bg-gray-50 text-black"
                  value={room.price}
                  onChange={(e) => setField("price", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Amenities (comma separated)</label>
                <input
                  className="w-full px-3 py-2 rounded bg-gray-50 text-black"
                  value={(room.amenities || []).join(", ")}
                  onChange={(e) => setAmenitiesFromString(e.target.value)}
                  placeholder="WiFi, Breakfast, Parking"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 rounded bg-gray-50 text-black"
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
              className={`mt-6 border-2 ${dragActive ? "border-dashed border-purple-400" : "border-dashed border-gray-500"} rounded p-6 text-center bg-slate-700`}
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
                <div className="text-gray-300">Drag & drop images here, or</div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
                >
                  Choose Images
                </button>
                <div className="text-sm text-gray-400">Recommended: JPG / PNG / WEBP — multiple allowed</div>
              </div>
            </div>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imagePreviews.map((p) => (
                  <div key={p.id} className="relative bg-slate-800 rounded overflow-hidden border border-slate-600">
                    <img src={p.url} alt="preview" className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePreview(p.id)}
                      className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Form buttons */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-submit px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Save Room"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-cancel px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Reset
                </button>
              </div>

              <div className="text-sm text-gray-400">You can add images and detailed info for the room.</div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}