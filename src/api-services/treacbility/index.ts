import { axiosApiRequest } from "@/utils/api";

export const getAllTreacbility = async ({ data }: { data: any }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/get-trasability-data`,
      params: { ...data },
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const updateTrasability = async ({ data }: { data: any }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/update-trasability`,
      data: { ...data },
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const deleteTrasability = async ({ id }: { id: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "delete",
      url: `/delete-trasability/${id}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
