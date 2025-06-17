import axios from "axios";

export const uploadToCloudinary = async (file, onProgress = () => {}) => {
  const cloudName = "ddanfyxo1";
  const unsignedPreset = "mycitiverse_unsigned";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", unsignedPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (typeof onProgress === "function") {
            onProgress(percent);
          }
        },
      }
    );

    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};
