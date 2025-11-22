import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/dashboard/shared/DashboardLayout";
import { tourGuideSidebarItems } from "../components/dashboard/tourGuide/tourGuideSidebarItems";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function TourGuideMyTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await fetch("http://localhost:5500/dashboard/api/tourGuide/myTours", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.status === "success") {
        setTours(data.data);
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
      toast.error("Failed to fetch tours");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tourId) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;

    try {
      const response = await fetch(`http://localhost:5500/tours/api/tour/${tourId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Tour deleted successfully");
        fetchTours();
      } else {
        toast.error("Failed to delete tour");
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
      toast.error("Error deleting tour");
    }
  };

  return (
    <DashboardLayout title="My Tours" sidebarItems={tourGuideSidebarItems}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Tours</h1>
          <Link
            to="/tour-guide/create-tour"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create New Tour
          </Link>
        </div>

        {loading ? (
          <div>Loading tours...</div>
        ) : tours.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>You haven't created any tours yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <div key={tour._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={tour.mainImage || "https://via.placeholder.com/300"}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{tour.title}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{tour.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-blue-600 font-bold">
                      ₹{tour.price?.amount || 0}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        to={`/tour-guide/edit-tour/${tour._id}`}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <FaEdit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(tour._id)}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
