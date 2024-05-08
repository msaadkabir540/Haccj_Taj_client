import { axiosApiRequest } from "@/utils/api";

export const getAllOilTemp = async ({ employeecode }: { employeecode: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "get",
      url: `/get-oil-temperature-data/${employeecode}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
