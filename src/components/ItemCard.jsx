import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const VITE_IMAGE_BASE_URL =
  import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:4000";
const favoritesCache = new Map();

export default function ItemCard({ item, prefix = "items" }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { user } = useAuth(); // Get the current user from context
  if (!item || typeof item !== "object") return null;
  const _id = item?._id ?? "";
  const images = item?.images ?? [];
  const title = item?.title ?? "Untitled";
  const location = item?.location ?? "Unknown";
  const price = item?.price ?? null;

  // Prevent default behavior of Link when clicking on the favorite button
  const handleLinkClick = (e) => {
    if (e.target.closest("button")) {
      e.preventDefault(); // Prevent the Link from navigating if the button is clicked
    }
  };

  // Fallback if images are empty or undefined, handle both uploads and public assets
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/fallback.jpg";
    
    if (imagePath.startsWith('/uploads/')) {
      return `${VITE_IMAGE_BASE_URL}${imagePath}`;
    }
    
    if (imagePath.startsWith('/assets/')) {
      return imagePath;
    }
    
    return `/assets/${imagePath}`;
  };

  const imageUrl = images.length > 0 ? getImageUrl(images[0]) : "/assets/fallback.jpg";

  const handleFavoriteClick = async () => {
    if (!user) {
      alert("You must be logged in to add or remove favorites");
      return;
    }

    try {
      let updatedFavorites;
      if (isFavorited) {
        updatedFavorites = await removeFavorite(user._id, _id);
      } else {
        updatedFavorites = await addFavorite(user._id, _id);
      }
      setIsFavorited(updatedFavorites.includes(_id));
    } catch (error) {
      // Silently handle error
    }
  };

  useEffect(() => {
    if (!user || !item?._id) return;

    const checkIfFavorite = async () => {
      if (favoritesCache.has(user._id)) {
        const favorites = favoritesCache.get(user._id);
        setIsFavorited(favorites.includes(item._id));
        return;
      }

      try {
        const res = await fetch(`${API_URL}/users/${user._id}/favorites`);
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const favorites = await res.json();
        const ids = favorites.map((fav) => fav._id);
        favoritesCache.set(user._id, ids);
        setIsFavorited(ids.includes(item._id));
      } catch (error) {
        // Silently handle error
      }
    };

    checkIfFavorite();
  }, [item?._id, user]);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImageLoading(false);
    img.onerror = () => {
      setImageError(true);
      setImageLoading(false);
    };
  }, [imageUrl]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-2xl flex flex-col relative min-h-[300px]">
      <Link
        to={`/${prefix}/${item._id}`}
        className="block"
        onClick={handleLinkClick}
      >
        <div
          className="h-48 bg-cover bg-center relative bg-gray-100"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        >
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={title}
            className="hidden"
            onError={(e) => {
              setImageError(true);
              e.target.parentNode.style.backgroundImage = `url('/assets/fallback.jpg')`;
            }}
          />
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-red-500 p-2 rounded-full shadow-md z-20"
          >
            {isFavorited ? "♥" : "♡"}
          </button>
        </div>

        <div className="p-6 flex flex-col space-y-2">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-gray-500">{location}</p>
          <p className="text-lg font-semibold text-blue-600">
            {price && !isNaN(Number(price))
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(Number(price))
              : "Price not available"}
          </p>
        </div>
      </Link>

      {item.status === "draft" && (
        <div className="px-6 pb-6">
          <Link
            to={`/${prefix}/${item._id}/edit`}
            className="inline-block mt-2 px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
          >
            Edit Draft
          </Link>
        </div>
      )}
    </div>
  );
}

// Separate functions for add and remove favorite actions (assuming you have them in api.js)
async function addFavorite(userId, itemId) {
  const res = await fetch(`${API_URL}/users/addFavorite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      itemId,
    }),
  });
  return await res.json();
}

async function removeFavorite(userId, itemId) {
  const res = await fetch(`${API_URL}/users/removeFavorite`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      itemId,
    }),
  });
  return await res.json();
}
