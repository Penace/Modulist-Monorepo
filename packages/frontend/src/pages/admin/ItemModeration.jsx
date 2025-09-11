import { useEffect, useState } from "react";
import {
  fetchDraftAndPendingItems,
  approveItem,
  rejectItem,
} from "../../services/api";
import ModalConfirm from "../../components/common/ModalConfirm";
import Button from "../../components/common/Button";
import { useToast } from "../../context/ToastProvider";
import ItemCard from "../../components/admin/AdminItemCard";

export default function AdminModeration() {
  const [pendingItems, setPendingItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      const data = await fetchDraftAndPendingItems(); // or fetchPendingItems
      setPendingItems([...data]); // force new array
      console.log("Loaded pending items:", data);
    } catch (err) {
      showToast("Failed to fetch data", "error");
    }
  };

  const openModal = (item, mode) => {
    setSelectedItem(item);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalMode(null);
  };

  const handleConfirm = async () => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      if (modalMode === "approve") {
        await approveItem(selectedItem._id);
        showToast("Item approved!", "success");
      } else {
        await rejectItem(selectedItem._id);
        showToast("Item rejected!", "success");
      }
      await loadPending();
    } catch (err) {
      console.error(err);
      showToast("Action failed. Please try again.", "error");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-6 bg-gray-50 space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-10">
        Moderate Items
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {pendingItems.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            No pending items.
          </p>
        )}
        {pendingItems.map((item) => (
          <ItemCard
            key={item._id}
            id={item._id}
            title={item.title}
            location={item.location}
            price={item.price}
            image={
              item.images?.length
                ? `/assets/${item.images[0]}`
                : "/assets/fallback.jpg"
            }
            fallbackImage="/assets/fallback.jpg"
            to={`/items/${item._id}`}
            actions={[
              <Button
                key="approve"
                variant="approve"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openModal(item, "approve");
                }}
              >
                Approve
              </Button>,
              <Button
                key="reject"
                variant="reject"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  openModal(item, "reject");
                }}
              >
                Reject
              </Button>,
            ]}
          />
        ))}
      </div>

      <ModalConfirm
        isOpen={!!selectedItem}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={
          modalMode === "approve"
            ? "Approve this item?"
            : "Reject this item?"
        }
        description="This action cannot be undone."
        loading={loading}
      />
    </div>
  );
}
