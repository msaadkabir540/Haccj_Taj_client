import { axiosApiRequest } from "@/utils/api";

export const getAllTemperature = async ({
  date,
  edate,
  data,
  navigate,
}: {
  date?: any;
  edate?: any;
  data?: any;
  navigate: any;
}) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/get-temperature-data`,
      params: { ...data, date, edate },
    });
    return response;
  } catch (e) {
    if (e?.response?.status === 401) {
      navigate("/login");
      localStorage.clear();
    }
    console.error(e);
  }
};

export const updateTemperature = async ({ data }: { data: any }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/update-temperature`,
      data: { ...data },
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const deleteTemperature = async ({ id }: { id: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "delete",
      url: `/delete-temperature/${id}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
