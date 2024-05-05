import { axiosApiRequest } from "@/utils/api";

export const getAllTreacbility = async ({ employeecode }: { employeecode: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "get",
      url: `/get-trasability-data/${employeecode}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
