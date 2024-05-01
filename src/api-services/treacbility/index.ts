import { axiosApiRequest } from "@/utils/api";

export const getAllTreacbility = async () => {
  try {
    const response = await axiosApiRequest({
      method: "get",
      url: `/get-trasability-data`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
