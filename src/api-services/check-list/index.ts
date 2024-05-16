import { axiosApiRequest } from "@/utils/api";

export const getCheckListByEmployeeCode = async ({ data }: { data: any }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/get-checklist-data`,
      params: { ...data },
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const addCheckList = async ({
  data,
}: {
  data: { employeecode: number; task: string; message: string; assign_to: number };
}) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/add-checklist`,
      data: data,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const updateCheckList = async ({
  data,
}: {
  data: { id?: number; employeecode: number; task: string; message: string; assign_to: number };
}) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/update-checklist`,
      data: data,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const deleteCheckList = async ({ id }: { id: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "delete",
      url: `/delete-checklist/${id}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
