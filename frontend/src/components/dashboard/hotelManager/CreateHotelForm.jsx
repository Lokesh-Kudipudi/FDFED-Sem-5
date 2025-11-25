import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateHotelForm({ onHotelCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    location: "",
    mainImage: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Hotel Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.mainImage.trim()) {
      newErrors.mainImage = "Main Image URL is required";
    } else {
      try {
        new URL(formData.mainImage);
      } catch (_) {
        newErrors.mainImage = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5500/hotels/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Hotel created successfully!");
        onHotelCreated(data.data);
      } else {
        toast.error(data.message || "Failed to create hotel");
      }
    } catch (error) {
      console.error("Error creating hotel:", error);
      toast.error("An error occurred while creating the hotel");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-2xl bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-2 text-center text-blue-400">
          Create Your Hotel
        </h2>
        <p className="text-slate-400 text-center mb-6">
          You don't have any hotel yet, register for one
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Hotel Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-3 bg-slate-700 rounded border ${
                errors.title ? "border-red-500" : "border-slate-600"
              } focus:border-blue-500 focus:outline-none`}
              placeholder="Enter hotel name"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full p-3 bg-slate-700 rounded border ${
                errors.description ? "border-red-500" : "border-slate-600"
              } focus:border-blue-500 focus:outline-none`}
              placeholder="Describe your hotel"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-3 bg-slate-700 rounded border ${
                  errors.address ? "border-red-500" : "border-slate-600"
                } focus:border-blue-500 focus:outline-none`}
                placeholder="Street address"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full p-3 bg-slate-700 rounded border ${
                  errors.location ? "border-red-500" : "border-slate-600"
                } focus:border-blue-500 focus:outline-none`}
                placeholder="City, Country"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Main Image URL
            </label>
            <input
              type="url"
              name="mainImage"
              value={formData.mainImage}
              onChange={handleChange}
              className={`w-full p-3 bg-slate-700 rounded border ${
                errors.mainImage ? "border-red-500" : "border-slate-600"
              } focus:border-blue-500 focus:outline-none`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.mainImage && (
              <p className="text-red-500 text-xs mt-1">{errors.mainImage}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded font-bold transition-colors duration-200"
          >
            Create Hotel
          </button>
        </form>
      </div>
    </div>
  );
}
