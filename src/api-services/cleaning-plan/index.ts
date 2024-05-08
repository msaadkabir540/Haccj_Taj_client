import { axiosApiRequest } from "@/utils/api";

export const getAllCleaningPlan = async ({ employeecode }: { employeecode: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "get",
      url: `/get-cleaning-data/${employeecode}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
