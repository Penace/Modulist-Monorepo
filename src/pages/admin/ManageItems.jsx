import { useEffect, useState, useRef } from "react";
import {
  fetchItems,
  deleteItem,
  updateItem,
} from "../../services/api";
import ModalConfirm from "../../components/common/ModalConfirm";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../context/ToastProvider";
import { Link } from "react-router-dom";

export default function ManageItems() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [savingItemId, setSavingItemId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    price: "",
    tag: "",
  });
  const titleInputRef = useRef();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    loadItems().finally(() => setLoading(false));
  }, []);

  const loadItems = async () => {
    const data = await fetchItems();
    setItems(data);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      await deleteItem(selectedItem._id || selectedItem.id);
      showToast("Item deleted.", "success");
      await loadItems();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete item.", "error");
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  if (loading && !items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-10 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 mt-12">
        Manage Items
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
          {items.map((item) => (
            <div
              key={item._id || item.id}
              className="relative z-0 bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out backdrop-blur-sm space-y-4"
            >
              {/* Thumbnail */}
              <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100">
                {item.images?.length ? (
                  <img
                    loading="lazy"
                    src={`/assets/${item.images[0]}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-2 text-center">
                {editingItemId === (item._id || item.id) ? (
                  <>
                    <input
                      ref={titleInputRef}
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg text-center text-gray-800"
                    />
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg text-center text-gray-800"
                    />
                    <input
                      type="text"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg text-center text-gray-800"
                    />
                    <select
                      value={editForm.tag}
                      onChange={(e) =>
                        setEditForm({ ...editForm, tag: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg text-center text-gray-800"
                    >
                      <option value="">No Tag</option>
                      <option value="featured">Featured</option>
                      <option value="auction">Auction</option>
                      <option value="sponsored">Sponsored</option>
                    </select>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.title}
                    </h2>
                    <p className="text-gray-500">{item.location}</p>
                    <p className="text-blue-600 font-semibold">
                      {item.price && !isNaN(Number(item.price))
                        ? `$${Number(item.price).toLocaleString()}`
                        : "Price not available"}
                    </p>
                    {item.tag && (
                      <p className="text-sm text-purple-600 font-medium">
                        {item.tag}
                      </p>
                    )}
                  </>
                )}
              </div>

              {editingItemId !== (item._id || item.id) && (
                <Link
                  to={`/items/${item._id || item.id}`}
                  className="absolute inset-0 z-0"
                  style={{ zIndex: 0 }}
                  aria-label="View item details"
                />
              )}

              {/* Actions */}
              <div className="flex space-x-4 pt-4 justify-center z-10 relative">
                {editingItemId === (item._id || item.id) ? (
                  <>
                    <Button
                      size="sm"
                      variant="approve"
                      onClick={async () => {
                        setSavingItemId(editingItemId);
                        try {
                          await updateItem(editingItemId, editForm);
                          showToast("Item updated.", "success");
                          await loadItems();
                          setEditingItemId(null);
                        } catch (err) {
                          console.error(err);
                          showToast("Failed to update item.", "error");
                        } finally {
                          setSavingItemId(null);
                        }
                      }}
                    >
                      {savingItemId === (item._id || item.id) ? (
                        <div className="flex items-center justify-center space-x-2">
                          <LoadingSpinner size={18} />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="reject"
                      onClick={() => setEditingItemId(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="primaryLight"
                      onClick={() => {
                        setEditingItemId(item._id || item.id);
                        setEditForm({
                          title: item.title,
                          location: item.location,
                          price: item.price,
                          tag: item.tag || "",
                        });
                        setTimeout(() => titleInputRef.current?.focus(), 10);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="reject"
                      onClick={() => {
                        setSelectedItem(item);
                        setModalOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ModalConfirm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete this item?"
        description="This action cannot be undone."
        loading={loading}
      />
    </div>
  );
}
