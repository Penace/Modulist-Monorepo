import { validateField } from "./validation";

export const handleChange = (e, setFormData, setErrors, setWarnings) => {
  const { name, value } = e.target;

  let newValue = value;

  if (name === "price") {
    newValue = value.replace(/[^\d]/g, "");
    if (newValue.length > 0) {
      newValue = `$${newValue}`;
    }
  } else if (
    ["bedrooms", "bathrooms", "squareFootage", "yearBuilt"].includes(name)
  ) {
    newValue = Number(value);
  } else if (["features", "amenities", "facilities"].includes(name)) {
    newValue = Array.isArray(value)
      ? value.filter((item) => typeof item === "string" && item.trim?.() !== "")
      : String(value)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
  } else if (name === "images") {
    if (newValue instanceof FileList) {
      newValue = Array.from(newValue);
    } else if (Array.isArray(newValue)) {
      newValue = newValue.filter(
        (f) => f instanceof File || typeof f === "string"
      );
    } else {
      newValue = [];
    }
  }

  setFormData((prev) => ({
    ...prev,
    [name]: newValue,
  }));

  let validationValue = newValue;
  if (Array.isArray(newValue)) {
    validationValue = newValue.filter(
      (item) => typeof item === "string" && item.trim?.() !== ""
    );
  }
  const { error, warning } = validateField(name, validationValue);

  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: error,
  }));

  setWarnings((prevWarnings) => ({
    ...prevWarnings,
    [name]: warning,
  }));
};

import { optimizeAndUploadImages } from "./imageUpload";

/**
 * Handles form submission to server
 */
export const handleSubmit = async ({
  formData,
  user,
  isEditMode,
  itemId,
  setSubmitting,
  navigate,
  toast,
}) => {
  try {
    setSubmitting(true);
    console.log("🧾 Submitting with images:", formData.images);
    const images = await optimizeAndUploadImages(formData.images);
    const payload = {
      ...formData,
      images,
      createdBy: user._id,
      status: "active",
    };

    const endpoint = isEditMode
      ? `/api/items/${itemId}`
      : "/api/items";
    const method = isEditMode ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Submit failed");

    const data = await res.json();
    toast.success("Item submitted successfully!");
    navigate(`/items/${data._id}`);
  } catch (err) {
    console.error("Submit failed:", err);
    toast.error("Failed to submit item.");
  } finally {
    setSubmitting(false);
  }
};

/**
 * Prepares data and opens review modal
 */
export const handleOpenReview = ({
  formData,
  setImagesForReview,
  setShowReviewModal,
  setReviewData,
  toast,
}) => {
  const requiredFields = [
    "title",
    "location",
    "address",
    "price",
    "description",
    "bedrooms",
    "bathrooms",
    "squareFootage",
    "propertyType",
    "yearBuilt",
  ];
  const isValid = requiredFields.every((field) => !!formData[field]);

  if (!isValid) {
    const showToast =
      typeof toast === "function"
        ? toast
        : typeof toast?.error === "function"
        ? (msg) => toast.error(msg)
        : (msg) =>
            console.warn(
              "Toast not available or improperly initialized:",
              toast,
              msg
            );

    showToast("Please complete all required fields before reviewing.", "error");
    return;
  }

  const cleaned = { ...formData };

  if (Array.isArray(cleaned.images)) {
    setImagesForReview(
      cleaned.images.map((file) => file.name || "unnamed.jpg")
    );
  }

  setReviewData(cleaned);
  setShowReviewModal(true);
};

/**
 * Handles saving the form as a draft
 */
export const handleSaveDraft = async ({
  formData,
  user,
  isEditMode,
  itemId,
  setSubmitting,
  toast,
  navigate,
}) => {
  try {
    setSubmitting(true);

    const duplicateCheckRes = await fetch(
      `/api/items/check-duplicate-draft?title=${encodeURIComponent(
        formData.title
      )}&userId=${user._id}`
    );
    if (duplicateCheckRes.ok) {
      const { exists } = await duplicateCheckRes.json();
      if (exists) {
        toast.error("A draft with this title already exists.");
        setSubmitting(false);
        return;
      }
    } else {
      console.warn("⚠️ Duplicate check failed.");
    }

    // Sanitize fields that must match enum values
    const cleanedFormData = {
      ...formData,
    };

    // Fill empty fields with placeholder values to pass schema validation
    const placeholderValues = {
      location: "Draft Location",
      address: "Draft Address",
      description: "Draft Description",
      bedrooms: 1,
      bathrooms: 1,
      squareFootage: 1,
      propertyType: "Unknown",
      yearBuilt: 2000,
      parkingAvailable: "Unknown",
      itemType: "sale",
      availableFrom: new Date().toISOString(),
      features: [],
      amenities: [],
      facilities: [],
      slug: `draft-${Date.now()}`,
    };

    for (const [key, value] of Object.entries(placeholderValues)) {
      if (
        cleanedFormData[key] === undefined ||
        cleanedFormData[key] === null ||
        cleanedFormData[key] === ""
      ) {
        cleanedFormData[key] = value;
      }
    }

    const itemTypeRaw = (formData.itemType || "")
      .toString()
      .trim()
      .toLowerCase();
    const validItemTypes = ["sale", "rent", "auction"];

    if (validItemTypes.includes(itemTypeRaw)) {
      cleanedFormData.itemType = itemTypeRaw;
    } else {
      delete cleanedFormData.itemType;
    }

    const images = formData.images?.length
      ? await optimizeAndUploadImages(formData.images)
      : [];

    const payload = {
      ...cleanedFormData,
      images,
      createdBy: user._id,
      status: "draft",
    };

    const endpoint = isEditMode
      ? `/api/items/${itemId}`
      : "/api/items";
    const method = isEditMode ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Draft save failed");

    const data = await res.json();
    toast.success("Draft saved successfully!");
    console.log("✅ Draft saved:", data);
    if (!isEditMode && data?._id && typeof navigate === "function") {
      navigate(`/publish/${data._id}/edit`);
    }
  } catch (err) {
    console.error("Draft save failed:", err);
    toast.error("Failed to save draft.");
  } finally {
    setSubmitting(false);
  }
};
