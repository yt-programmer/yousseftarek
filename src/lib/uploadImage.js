import axios from "axios";

const API = (import.meta.env.VITE_API || "").replace(/\/$/, "");
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];
export const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const SERVER_MAX_BYTES = 3 * 1024 * 1024;

// Cloudinary is used when both variables are set; otherwise images go to the site's own backend (/api/uploads).
export const uploadSettings = () => {
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
  const forceServer = String(import.meta.env.VITE_UPLOAD_PROVIDER || "").toLowerCase() === "server";
  const provider = cloud && preset && !forceServer ? "cloudinary" : "server";
  return { provider, cloud, preset, label: provider === "cloudinary" ? "Cloudinary" : "your website server" };
};

export class UploadError extends Error {}

export const validateImageFile = (file) => {
  if (!file) throw new UploadError("Choose an image first.");
  if (!ALLOWED.includes(file.type)) throw new UploadError("Unsupported file. Use a PNG, JPG, WEBP or GIF image.");
  if (file.size > MAX_INPUT_BYTES) throw new UploadError("The image is larger than 10 MB. Choose a smaller one.");
};

// Large photos are resized (max 1600 px) and re-encoded as WEBP in the browser: faster, cheaper, and far less likely to fail.
export const shrinkImage = async (file, { maxSide = 1600, quality = 0.86 } = {}) => {
  if (file.type === "image/gif" || typeof createImageBitmap !== "function") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 400 * 1024) { bitmap.close?.(); return file; }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
};

const friendly = (error, provider) => {
  if (error instanceof UploadError) return error.message;
  const status = error.response?.status;
  const serverMessage = error.response?.data?.error?.message || error.response?.data?.message;
  if (error.code === "ECONNABORTED") return "The upload took too long. Check your connection and try again.";
  if (!error.response) return `Could not reach ${provider === "cloudinary" ? "Cloudinary" : "the server"}. Check your internet connection${provider === "server" ? " and that the backend is running" : ""}.`;
  if (provider === "cloudinary") {
    if (/preset/i.test(serverMessage || "")) return "Cloudinary says the upload preset was not found. Check VITE_CLOUDINARY_UPLOAD_PRESET and make sure the preset is set to “Unsigned”.";
    if (/cloud/i.test(serverMessage || "") || status === 401 || status === 404) return "Cloudinary rejected the request. Check VITE_CLOUDINARY_CLOUD_NAME and the unsigned upload preset.";
    return serverMessage || "Cloudinary could not upload the image.";
  }
  if (status === 401) return "Your session expired. Please log in again.";
  return serverMessage || "The server could not upload the image.";
};

export async function uploadImage(file, { onProgress } = {}) {
  const settings = uploadSettings();
  try {
    validateImageFile(file);
    const body = await shrinkImage(file);
    if (settings.provider === "cloudinary") {
      const form = new FormData();
      form.append("file", body);
      form.append("upload_preset", settings.preset);
      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${settings.cloud}/image/upload`, form, { timeout: 60000, onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)) });
      if (!data?.secure_url) throw new UploadError("Cloudinary did not return an image URL.");
      return data.secure_url;
    }
    if (body.size > SERVER_MAX_BYTES) throw new UploadError("The image is still larger than 3 MB after compression. Choose a smaller one.");
    const { data } = await axios.post(`${API}/api/uploads`, body, { withCredentials: true, timeout: 60000, headers: { "Content-Type": body.type || file.type }, onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)) });
    if (!data?.data?.url) throw new UploadError("The server did not return an image URL.");
    return data.data.url;
  } catch (error) {
    throw new UploadError(friendly(error, settings.provider));
  }
}
