import { axiosApiRequest } from "@/utils/api";

export const getAllOilTempAndMachine = async ({ data }: { data: any }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/get-oil-temperature-data`,
      params: { ...data },
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const updateOilTemp = async ({ data }: { data: any }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/update-oil-temperature`,
      data: data,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const deleteOilTemperature = async ({ id }: { id: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "delete",
      url: `/delete-oil-temperature/${id}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
