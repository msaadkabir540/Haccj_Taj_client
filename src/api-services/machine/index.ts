import { axiosApiRequest } from "@/utils/api";

export const getCheckListByEmployeeCode = async ({ employeecode }: { employeecode: string }) => {
  try {
    const response = await axiosApiRequest({
      method: "get",
      url: `/add-oil-temperature-machines`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const addMachine = async ({
  data,
}: {
  data: { employeecode: number; machine_name: string };
}) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/add-oil-temperature-machines`,
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

export const deleteMachine = async ({ id }: { id: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "delete",
      url: `/delete-oil-temperature-machine/${id}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
