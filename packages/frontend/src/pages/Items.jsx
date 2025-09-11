import { fetchItems } from "../services/api";
import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadItems() {
      try {
        const data = await fetchItems();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-500">Loading Items...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center space-y-8 py-20 px-6">
      <h1 className="text-4xl font-bold text-gray-900">Items</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by title or location..."
        className="mb-10 px-4 py-2 border border-gray-300 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onFocus={(e) => e.stopPropagation()}
      />

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl transition-all duration-500">
        {filteredItems.length > 0 ? (
          <>
            {filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </>
        ) : (
          <div className="col-span-full text-center py-20 text-gray-400 text-xl">
            No items found.
          </div>
        )}
      </div>
    </div>
  );
}
