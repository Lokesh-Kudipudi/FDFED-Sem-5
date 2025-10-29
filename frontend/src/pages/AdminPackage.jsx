import React, { useState } from "react";

const AdminPackage = () => {
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    mainImage: "",
    images: "",
    rating: "",
    duration: "",
    startLocation: "",
    description: "",
    language: "",
    priceAmount: "",
    priceDiscount: "",
    includes: "",
    availableMonths: "",
    status: "active",
    destinations: [],
    itinerary: [],
    bookingDetails: [],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===== Dynamic Sections =====
  const addDestination = () =>
    setFormData({
      ...formData,
      destinations: [
        ...formData.destinations,
        { name: "", image: "" },
      ],
    });

  const removeDestination = () =>
    setFormData({
      ...formData,
      destinations: formData.destinations.slice(0, -1),
    });

  const addItinerary = () =>
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        { day: "", location: "", activities: "" },
      ],
    });

  const removeItinerary = () =>
    setFormData({
      ...formData,
      itinerary: formData.itinerary.slice(0, -1),
    });

  const addBooking = () =>
    setFormData({
      ...formData,
      bookingDetails: [
        ...formData.bookingDetails,
        {
          startDate: "",
          startDay: "",
          endDate: "",
          endDay: "",
          status: "",
          discount: "",
        },
      ],
    });

  const removeBooking = () =>
    setFormData({
      ...formData,
      bookingDetails: formData.bookingDetails.slice(0, -1),
    });

  // ===== Submission =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData };

    // Convert comma-separated values to arrays
    data.tags = data.tags
      ? data.tags.split(",").map((t) => t.trim())
      : [];
    data.images = data.images
      ? data.images.split(",").map((i) => i.trim())
      : [];
    data.includes = data.includes
      ? data.includes.split(",").map((i) => i.trim())
      : [];
    data.availableMonths = data.availableMonths
      ? data.availableMonths.split(",").map((m) => m.trim())
      : [];

    data.price = {
      currency: "USD",
      amount: parseFloat(data.priceAmount || 0),
      discount: parseFloat(data.priceDiscount || 0),
    };

    try {
      const res = await fetch(
        "http://localhost:5500/tours/api/tour",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (res.ok) {
        alert("✅ Package created successfully!");
      } else {
        const err = await res.json();
        alert(`❌ Error: ${err.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating the package.");
    }
  };

  return (
    <div className="flex justify-center py-10 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create New Package
        </h2>

        {/* Basic Fields */}
        {[
          ["Title", "title", "text"],
          ["Tags (comma-separated)", "tags", "text"],
          ["Main Image URL", "mainImage", "text"],
          ["Other Images (comma-separated)", "images", "text"],
          ["Rating", "rating", "number"],
          ["Duration", "duration", "text"],
          ["Start Location", "startLocation", "text"],
          ["Language", "language", "text"],
          ["Price (Amount)", "priceAmount", "number"],
          [
            "Price Discount (e.g. 0.15)",
            "priceDiscount",
            "number",
          ],
          ["Includes (comma-separated)", "includes", "text"],
          [
            "Available Months (comma-separated)",
            "availableMonths",
            "text",
          ],
        ].map(([label, name, type]) => (
          <div key={name} className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
        ))}

        {/* Description */}
        <label className="block text-sm font-semibold mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none mb-6"
        ></textarea>

        {/* Status */}
        <label className="block text-sm font-semibold mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 mb-6 w-full"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* ===== Destinations ===== */}
        <h3 className="text-xl font-semibold border-b mb-3">
          Destinations
        </h3>
        {formData.destinations.map((dest, idx) => (
          <fieldset
            key={idx}
            className="border border-gray-300 rounded-md p-3 mb-3 bg-gray-50"
          >
            <legend className="font-semibold text-gray-700">
              Destination {idx + 1}
            </legend>
            <input
              type="text"
              placeholder="Name"
              className="border rounded-md px-3 py-2 w-full my-1"
              value={dest.name}
              onChange={(e) => {
                const updated = [...formData.destinations];
                updated[idx].name = e.target.value;
                setFormData({
                  ...formData,
                  destinations: updated,
                });
              }}
            />
            <input
              type="text"
              placeholder="Image URL"
              className="border rounded-md px-3 py-2 w-full my-1"
              value={dest.image}
              onChange={(e) => {
                const updated = [...formData.destinations];
                updated[idx].image = e.target.value;
                setFormData({
                  ...formData,
                  destinations: updated,
                });
              }}
            />
          </fieldset>
        ))}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={addDestination}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Destination
          </button>
          <button
            type="button"
            onClick={removeDestination}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Remove Last Destination
          </button>
        </div>

        {/* ===== Itinerary ===== */}
        <h3 className="text-xl font-semibold border-b mb-3">
          Itinerary
        </h3>
        {formData.itinerary.map((it, idx) => (
          <fieldset
            key={idx}
            className="border border-gray-300 rounded-md p-3 mb-3 bg-gray-50"
          >
            <legend className="font-semibold text-gray-700">
              Day {idx + 1}
            </legend>
            <input
              type="number"
              placeholder="Day"
              className="border rounded-md px-3 py-2 w-full my-1"
              value={it.day}
              onChange={(e) => {
                const updated = [...formData.itinerary];
                updated[idx].day = e.target.value;
                setFormData({ ...formData, itinerary: updated });
              }}
            />
            <input
              type="text"
              placeholder="Location"
              className="border rounded-md px-3 py-2 w-full my-1"
              value={it.location}
              onChange={(e) => {
                const updated = [...formData.itinerary];
                updated[idx].location = e.target.value;
                setFormData({ ...formData, itinerary: updated });
              }}
            />
            <input
              type="text"
              placeholder="Activities (comma-separated)"
              className="border rounded-md px-3 py-2 w-full my-1"
              value={it.activities}
              onChange={(e) => {
                const updated = [...formData.itinerary];
                updated[idx].activities = e.target.value;
                setFormData({ ...formData, itinerary: updated });
              }}
            />
          </fieldset>
        ))}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={addItinerary}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Itinerary Day
          </button>
          <button
            type="button"
            onClick={removeItinerary}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Remove Last Itinerary
          </button>
        </div>

        {/* ===== Bookings ===== */}
        <h3 className="text-xl font-semibold border-b mb-3">
          Booking Details
        </h3>
        {formData.bookingDetails.map((b, idx) => (
          <fieldset
            key={idx}
            className="border border-gray-300 rounded-md p-3 mb-3 bg-gray-50"
          >
            <legend className="font-semibold text-gray-700">
              Booking {idx + 1}
            </legend>
            {[
              "startDate",
              "startDay",
              "endDate",
              "endDay",
              "status",
              "discount",
            ].map((field) => (
              <input
                key={field}
                type={field === "discount" ? "number" : "text"}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                className="border rounded-md px-3 py-2 w-full my-1"
                value={b[field]}
                onChange={(e) => {
                  const updated = [...formData.bookingDetails];
                  updated[idx][field] = e.target.value;
                  setFormData({
                    ...formData,
                    bookingDetails: updated,
                  });
                }}
              />
            ))}
          </fieldset>
        ))}
        <div className="flex gap-2 mb-8">
          <button
            type="button"
            onClick={addBooking}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Booking
          </button>
          <button
            type="button"
            onClick={removeBooking}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Remove Last Booking
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700"
        >
          Create Package
        </button>
      </form>
    </div>
  );
};

export default AdminPackage;
