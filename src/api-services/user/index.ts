import { axiosApiRequest } from "@/utils/api";

export const getAllEmployees = async () => {
  try {
    const response = await axiosApiRequest({
      method: "get",
      url: `/get-all-employee`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const addEmployees = async ({ data }: { data: any }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/add-employee`,
      data: data,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
