import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const axiosApiRequest = async (configs) => {
  try {
    const res = await instance(configs);
    return res.data; // Return response data
  } catch (error) {
    console.error(error);
    return error;
    throw error; // Re-throw the error for the caller to handle
  }
};
