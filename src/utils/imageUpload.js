/**
 * Optimize image file name and upload to backend
 * @ param {File[]} files - array of File objects
 * @ returns {Promise<string[]>} - array of uploaded image URLs
 */
export async function optimizeAndUploadImages(files) {
  const uploadedUrls = [];
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

  for (const file of files) {
    const formData = new FormData();
    const ext = file.name.split(".").pop();
    const name = file.name.split(".")[0].replace(/\s+/g, "-").toLowerCase();
    const timestamp = Date.now();
    const newFileName = `${name}-${timestamp}.${ext}`;
    const renamedFile = new File([file], newFileName, { type: file.type });

    formData.append("images", renamedFile);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/uploads`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Upload response error:", errorText);
      throw new Error("Image upload failed");
    }

    const { urls } = await res.json();
    uploadedUrls.push(...urls);
  }

  return uploadedUrls;
}
