import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/shared/DashboardLayout.jsx";
import { adminSidebarItems } from "../../components/dashboard/admin/adminSidebarItems.jsx";
import { API } from "../../config/api";

export default function AdminVerifications() {
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [tours, setTours] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("hotels");

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const queueRes = await fetch(API.ADMIN.VERIFICATIONS, {
        credentials: "include",
      });

      if (!queueRes.ok) {
        throw new Error("Failed to load verification queue");
      }

      const queueData = await queueRes.json();
      setHotels(queueData.data?.hotels || []);
      setTours(queueData.data?.tours || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const handleStatusUpdate = async (type, id, status) => {
    const url =
      type === "hotel" ? API.ADMIN.HOTEL_STATUS(id) : API.ADMIN.TOUR_STATUS(id);
    try {
      const res = await fetch(url, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      if (type === "hotel") {
        setHotels((prev) => prev.filter((h) => h._id !== id));
      } else {
        setTours((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const pendingCount = useMemo(() => hotels.length + tours.length, [hotels, tours]);
  const collectPhotos = (item, type) => {
    const source = [];
    if (item.mainImage) source.push(item.mainImage);
    if (Array.isArray(item.images)) source.push(...item.images);
    if (type === "tours" && Array.isArray(item.destinations)) {
      source.push(...item.destinations.map((d) => d.image).filter(Boolean));
    }
    return [...new Set(source.filter(Boolean))];
  };

  if (loading) {
    return (
      <DashboardLayout title="Verifications" sidebarItems={adminSidebarItems}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Verifications" sidebarItems={adminSidebarItems}>
        <div className="p-8 text-red-600 font-medium">Error: {error}</div>
      </DashboardLayout>
    );
  }

  const list = activeTab === "hotels" ? hotels : tours;

  return (
    <DashboardLayout title="Verifications" sidebarItems={adminSidebarItems}>
      <div className="p-8 space-y-6">
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2">
            Verification Queue
          </h1>
          <p className="text-gray-500 text-lg">
            Review newly created hotels and tours before publishing.
          </p>
          <p className="text-sm text-amber-700 mt-2">
            Pending items: <span className="font-bold">{pendingCount}</span>. After approving, assign employees from Hotel Management or Packages Management.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("hotels")}
            className={`px-4 py-2 rounded-xl font-bold ${
              activeTab === "hotels"
                ? "bg-[#003366] text-white"
                : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            Hotels ({hotels.length})
          </button>
          <button
            onClick={() => setActiveTab("tours")}
            className={`px-4 py-2 rounded-xl font-bold ${
              activeTab === "tours"
                ? "bg-[#003366] text-white"
                : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            Tours ({tours.length})
          </button>
        </div>

        {list.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-10 text-center border-2 border-dashed border-gray-200 text-gray-500">
            No pending {activeTab} for verification.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {list.map((item) => {
              const photos = collectPhotos(item, activeTab);
              return (
              <div key={item._id} className="bg-white rounded-2xl border border-gray-100 shadow p-5">
                <div className="mb-4">
                  <div className="h-44 w-full overflow-hidden rounded-xl bg-gray-100">
                    {photos[0] ? (
                      <img
                        src={photos[0]}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                        No photo available
                      </div>
                    )}
                  </div>
                  {photos.length > 1 && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {photos.slice(1).map((photo, idx) => (
                        <div key={`${item._id}-photo-${idx}`} className="h-16 overflow-hidden rounded-lg bg-gray-100">
                          <img src={photo} alt={`${item.title} ${idx + 2}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {activeTab === "hotels"
                    ? item.location || "Location N/A"
                    : item.startLocation || "Start location N/A"}
                </p>
                {activeTab === "hotels" && (
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold text-gray-700">Address:</span>{" "}
                    {item.address || "Address not provided"}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                  {item.description || "No description provided."}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  {activeTab === "hotels" ? (
                    <>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">Rating</span>
                        <p className="font-bold text-gray-800">{item.rating ?? "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">Room Types</span>
                        <p className="font-bold text-gray-800">{item.roomType?.length || 0}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">Amenities</span>
                        <p className="font-bold text-gray-800">{item.amenities?.length || 0}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">All Photos</span>
                        <p className="font-bold text-gray-800">{photos.length}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">Commission</span>
                        <p className="font-bold text-gray-800">{item.commissionRate || 10}%</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">Duration</span>
                        <p className="font-bold text-gray-800">{item.duration || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">Price</span>
                        <p className="font-bold text-gray-800">
                          {item.price?.currency || "INR"} {item.price?.amount || 0}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">Max People</span>
                        <p className="font-bold text-gray-800">{item.maxPeople || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">Language</span>
                        <p className="font-bold text-gray-800">{item.language || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">All Photos</span>
                        <p className="font-bold text-gray-800">{photos.length}</p>
                      </div>
                    </>
                  )}
                </div>

                {activeTab === "hotels" && Array.isArray(item.roomType) && item.roomType.length > 0 && (
                  <div className="mt-3 rounded-xl border border-gray-100 bg-white p-3">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                      Room Details
                    </p>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {item.roomType.map((room, idx) => (
                        <div key={`${item._id}-room-${idx}`} className="rounded-lg bg-gray-50 px-3 py-2">
                          <p className="text-sm font-bold text-gray-900">{room.title || "Room Type"}</p>
                          <p className="text-xs text-gray-600">
                            Price: {room.price || "N/A"} | Rating: {room.rating ?? "N/A"}
                          </p>
                          {Array.isArray(room.features) && room.features.length > 0 && (
                            <p className="text-xs text-gray-600 line-clamp-1">
                              Features: {room.features.join(", ")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "tours" && Array.isArray(item.itinerary) && item.itinerary.length > 0 && (
                  <div className="mt-3 rounded-xl border border-gray-100 bg-white p-3">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                      Itinerary
                    </p>
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {item.itinerary.map((dayPlan, idx) => (
                        <div key={`${item._id}-itinerary-${idx}`} className="rounded-lg bg-gray-50 px-3 py-2">
                          <p className="text-sm font-bold text-gray-900">
                            Day {dayPlan.day || idx + 1}: {dayPlan.location || "Location TBA"}
                          </p>
                          {Array.isArray(dayPlan.activities) && dayPlan.activities.length > 0 ? (
                            <p className="text-xs text-gray-600 line-clamp-2">
                              Activities: {dayPlan.activities.join(", ")}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-500">Activities not provided.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 rounded-xl border border-gray-100 bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    {activeTab === "hotels" ? "Owner Details" : "Tour Guide Details"}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {activeTab === "hotels"
                      ? item.ownerId?.fullName || "Unknown Owner"
                      : item.tourGuideId?.fullName || "Unknown Guide"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {activeTab === "hotels"
                      ? item.ownerId?.email || "No email"
                      : item.tourGuideId?.email || "No email"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {activeTab === "hotels"
                      ? item.ownerId?.phone || "No phone"
                      : item.tourGuideId?.phone || "No phone"}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        activeTab === "hotels" ? "hotel" : "tour",
                        item._id,
                        "active"
                      )
                    }
                    className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        activeTab === "hotels" ? "hotel" : "tour",
                        item._id,
                        "inactive"
                      )
                    }
                    className="flex-1 px-3 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
