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

export const updateTemperature = async ({ data }: { data: any }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/update-temperature`,
      data: { ...data },
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const deleteTemperature = async ({ id }: { id: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "delete",
      url: `/delete-temperature/${id}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
