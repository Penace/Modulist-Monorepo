import { useEffect, useState } from "react";
import { fetchItemsByStatus } from "../services/api";
import { useSearchParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import { useAuth } from "../context/AuthProvider";
import DashboardSidebar from "../components/common/DashboardSidebar";

export default function PublisherDashboard() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "draft";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadItems() {
      try {
        // Add cache-busting timestamp to the status query
        const res = await fetchItemsByStatus(status, user?._id);
        console.log("Fetched Items:", res); // Debug log
        setItems(res);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user?._id) {
      loadItems();
    }
  }, [status, user]);

  return (
    <div className="flex">
      <DashboardSidebar
        title="Publisher Panel"
        links={[
          { to: "/publisher-dashboard", label: "My Items" },
          { to: "/publish", label: "Create New Item" },
          { to: "/publisher-dashboard?status=pending", label: "Pending Approval" },
        ]}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className="flex-1 max-w-5xl mx-auto py-4 px-4 mb-24">
        <h1 className="text-2xl font-bold mb-4 capitalize">
          {status} Items
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <>
            {console.log("Items array is empty:", items)}
            <p>
              {status === "draft"
                ? "No saved drafts found."
                : "No items found for this status."}
            </p>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={{ ...item, _id: item._id }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
