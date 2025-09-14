import { axiosApiRequest } from "@/utils/api";

export const getAttendance = async ({
  to_date,
  form_date,
  employeeId,
  employeeCode,
}: {
  to_date: string;
  form_date: string;
  employeeId?: string;
  employeeCode: string;
}) => {
  try {
    const response = await axiosApiRequest({
      method: "get",
      url: `/get-attendance?employeeCode=${employeeCode}&from_date=${form_date}&to_date=${to_date}&employeeId=${employeeId}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
