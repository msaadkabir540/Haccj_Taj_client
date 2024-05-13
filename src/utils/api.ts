// import axios from "axios";

// const instance = axios.create({
//   baseURL: import.meta.env.VITE_BASE_URL,
// });

// export const axiosApiRequest = async (configs) => {
//   try {
//     const res = await instance(configs);
//     return res.data; // Return response data
//   } catch (error) {
//     console.error(error);
//     return error;
//     throw error; // Re-throw the error for the caller to handle
//   }
// };

import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const axiosApiRequest = async (configs) => {
  try {
    // Get token from wherever you store it (e.g., localStorage)
    const token = localStorage.getItem("token");

    // Add token to request headers
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };

    // Merge the existing headers with the new ones
    const updatedConfigs = {
      ...configs,
      headers: { ...configs.headers, ...headers },
    };

    const res = await instance(updatedConfigs);
    return res.data; // Return response data
  } catch (error) {
    console.error(error);
    // Rethrow the error for the caller to handle
    throw error;
  }
};
