// src/components/ReviewModal.jsx
import Button from "./common/Button";

export default function ReviewModal({ isOpen, onClose, onConfirm, item }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Review Item
        </h2>

        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <strong>Title:</strong> {item.title}
          </div>
          <div>
            <strong>Location:</strong> {item.location}
          </div>
          <div>
            <strong>Price:</strong> ${Number(item.price).toLocaleString()}
          </div>
          <div>
            <strong>Description:</strong>
            <p className="mt-1 text-gray-600">{item.description}</p>
          </div>
          <div>
            <strong>Images:</strong>
            <ul className="mt-1 list-disc list-inside text-blue-500 space-y-1">
              {item.images.map((img, i) => {
                const url = typeof img === "string" ? img : img.url;
                const name =
                  typeof img === "string"
                    ? url.split("/").pop()
                    : img.name || url.split("/").pop();
                return (
                  <li
                    key={i}
                    className="flex items-center gap-2 group relative"
                    title="Click to view full image"
                  >
                    <img
                      src={url}
                      alt={`preview-${i}`}
                      className="w-8 h-8 object-cover rounded-md border border-gray-200"
                    />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-700 transition-colors"
                    >
                      {name}
                    </a>
                    {/* File size if available */}
                    {typeof img === "object" && img.size && (
                      <span className="text-xs text-gray-500">
                        ({(img.size / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button variant="primaryLight" onClick={onClose}>
            Edit
          </Button>
          <Button variant="approve" onClick={onConfirm}>
            Confirm & Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
