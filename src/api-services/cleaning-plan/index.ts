import { axiosApiRequest } from "@/utils/api";

export const getAllCleaningPlan = async ({ data }: { data: any }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/get-cleaning-data`,
      params: { ...data },
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const updateCleaningPlan = async ({ data }: { data: any }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/update-cleaning`,
      params: { ...data },
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const deleteCleaningPlan = async ({ id }: { id: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "delete",
      url: `/delete-cleaning/${id}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
