import { normalizeSlug } from "../utils/normalize"; // Adjust path if needed
const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:4000/api`;

export const IMAGE_BASE_URL =
  import.meta.env.VITE_IMAGE_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:4000`;

// --- Centralized Fetch Helper
async function fetchWithHandling(url, options = {}, fallback = null) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error(
        `API Fetch Error: ${response.status} - ${response.statusText}`
      );
      throw new Error(`Fetch failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error:`, error.message);
    return fallback;
  }
}

// --- Items
export async function fetchItems() {
  return fetchWithHandling(`${API_URL}/items`, {}, []);
}

export async function fetchItemById(id) {
  return fetchWithHandling(`${API_URL}/items/${id}`, {}, null);
}

// Named export for getItemById using fetchItemById
export { fetchItemById as getItemById };

export async function fetchItemsByTag(tag) {
  return fetchWithHandling(`${API_URL}/items?tag=${tag}`, {}, []);
}

// Fetch items by status, optionally filtered by userId
export async function fetchItemsByStatus(status, userId) {
  try {
    const res = await fetch(
      `${API_URL}/items/status/${status}?userId=${userId}&t=${Date.now()}`
    );
    if (!res.ok) throw new Error("Fetch failed: " + res.status);
    return await res.json();
  } catch (err) {
    console.error("API Error:", err.message);
    throw err;
  }
}

// --- Publish
export async function createItem(itemData) {
  try {
    const res = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Fetch Error:", res.status, "-", errorText);
      throw new Error(`Fetch failed: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}

export async function deleteItem(id) {
  return fetchWithHandling(`${API_URL}/items/${id}`, {
    method: "DELETE",
  });
}

export async function updateItem(id, updateData) {
  return fetchWithHandling(`${API_URL}/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
}

// --- Favorites
export async function getFavorites(userId) {
  return fetchWithHandling(`${API_URL}/users/${userId}/favorites`, {}, null);
}

// Add a favorite
export async function addFavorite(userId, itemId) {
  try {
    const res = await fetch(`${API_URL}/users/addFavorite`, {
      method: "POST", // POST for adding a favorite
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        itemId,
      }),
    });

    if (res.ok) {
      return await res.json(); // Return the updated list of favorites
    }
    throw new Error("Failed to add favorite");
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
}

// Remove a favorite
export async function removeFavorite(userId, itemId) {
  try {
    const res = await fetch(`${API_URL}/users/removeFavorite`, {
      method: "DELETE", // DELETE for removing a favorite
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        itemId,
      }),
    });

    if (res.ok) {
      return await res.json(); // Return the updated list of favorites
    }
    throw new Error("Failed to remove favorite");
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
}

// --- Auth
export async function fetchUserByEmail(email) {
  return fetchWithHandling(`${API_URL}/users/email/${email}`, {}, null);
}

// --- User Profile
export async function fetchUserById(id) {
  return fetchWithHandling(`${API_URL}/users/${id}`, {}, null);
}

export async function getUserById(id) {
  return fetchWithHandling(`${API_URL}/users/${id}`, {}, null);
}

// --- Utilities
export function isPublisherOrAdmin(user) {
  return user?.role === "publisher" || user?.role === "admin";
}

// --- User Moderation
export async function fetchPendingUsers() {
  return fetchWithHandling(`${API_URL}/users?approved=false`, {}, []);
}

export async function approveUser(id) {
  return fetchWithHandling(`${API_URL}/users/${id}/approve`, {
    method: "PATCH",
  });
}

export async function rejectUser(id) {
  return fetchWithHandling(`${API_URL}/users/${id}/reject`, {
    method: "PATCH",
  });
}

// --- Moderation: Items
export async function approveItem(id) {
  return fetchWithHandling(`${API_URL}/items/${id}/approve`, {
    method: "POST",
  });
}

export async function rejectItem(id) {
  return fetchWithHandling(`${API_URL}/items/${id}/reject`, {
    method: "POST",
  });
}

// --- Fetch Draft and Pending Items
export async function fetchDraftAndPendingItems() {
  const allItems = await fetchWithHandling(`${API_URL}/items`, {}, []);
  return allItems.filter((item) => item.status === "pending");
}

// --- Settings

export async function updateSettings(settings) {
  return fetchWithHandling(`${API_URL}/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });
}

export async function getSettings() {
  return fetchWithHandling(`${API_URL}/settings`, {}, {});
}

// Check for existing draft item by normalized slug
export async function checkDuplicateDraft(titleOrSlug, userId) {
  const slug = normalizeSlug(titleOrSlug);
  try {
    const res = await fetch(
      `${API_URL}/items/status/draft?userId=${userId}&slug=${slug}&t=${Date.now()}`
    );
    if (!res.ok) throw new Error("Fetch failed: " + res.status);
    const items = await res.json();
    return items.some((item) => item.slug === slug);
  } catch (err) {
    console.error("API Error:", err.message);
    throw err;
  }
}
