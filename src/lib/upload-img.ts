import axios from "./axios";

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  console.log(file, "working");

  const response = await axios.post("/common/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data.url;
};
