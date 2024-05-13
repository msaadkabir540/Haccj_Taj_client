import { axiosApiRequest } from "@/utils/api";

export const getAllEquipment = async () => {
  try {
    const response = await axiosApiRequest({
      method: "get",
      url: `/get-equipment-data`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const addEquipment = async ({
  data,
}: {
  data: { employeecode: number; equipment_name: string };
}) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/add-equipment`,
      data: data,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const deleteEquipment = async ({ id }: { id: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "delete",
      url: `/delete-temperature-equipment/${id}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
