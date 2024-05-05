import { axiosApiRequest } from "@/utils/api";

export const getCheckListByEmployeeCode = async ({ employeecode }: { employeecode: string }) => {
  try {
    const response = await axiosApiRequest({
      method: "get",
      url: `/get-checklist-data/${employeecode}`,
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
