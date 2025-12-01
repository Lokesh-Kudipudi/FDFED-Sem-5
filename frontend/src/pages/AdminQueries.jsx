import { useState, useEffect } from "react";
import DashboardLayout from "../components/dashboard/shared/DashboardLayout";
import { adminSidebarItems } from "../components/dashboard/admin/adminSidebarItems.jsx";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await fetch(
          "http://localhost:5500/dashboard/api/admin/queries",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch queries");
        }

        const data = await response.json();
        setQueries(data.userQueries || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const handleDeleteQuery = async (id) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;

    try {
      const response = await fetch(
        `http://localhost:5500/dashboard/api/admin/queries/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setQueries(queries.filter((q) => q._id !== id));
      } else {
        alert("Failed to delete query");
      }
    } catch (error) {
      console.error("Error deleting query:", error);
      alert("Error deleting query");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <DashboardLayout title="User Queries" sidebarItems={adminSidebarItems}>
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800">All Queries</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Query</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {queries.length > 0 ? (
                  queries.map((query) => (
                    <tr key={query._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {query.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{query.email}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {query.reason}
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                        {query.query}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(query.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteQuery(query._id)}
                          className="text-red-500 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">
                      No queries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
