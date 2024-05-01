import { axiosApiRequest } from "@/utils/api";

export const getAllTemperature = async ({ id }: { id: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "get",
      url: `/get-temperature-data/${id}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
