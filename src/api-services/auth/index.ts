import { axiosApiRequest } from "@/utils/api";

import { LoginFromInterface } from "@/interface/account-interface";
import createNotification from "@/common/create-notification";

export const signIn = async ({ data }: { data: LoginFromInterface }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/login`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: { employeecode: Number(data?.employeecode), password: data?.password },
    });

    return response;
  } catch (error) {
    if (error?.response?.data?.status === false) {
      createNotification({
        type: "error",
        message: error?.response?.data?.message || "Failed To Login.",
      });
    }
    console.error(error);
  }
};

export const resetPassword = async ({ data }: { data: LoginFromInterface }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/reset-password`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: { employeecode: Number(data?.employeecode), password: data?.password },
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
//laravel.haccptaj.com/api/validate-employee/123
export const employeeValidate = async ({ employeecode }: { employeecode: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "get",
      url: `/validate-employee/${Number(employeecode)}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const signUp = async ({ data }: { data: LoginFromInterface }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/register`,
      data: { employeecode: Number(data?.employeecode), password: data?.password },
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const forgotPassword = async ({ employeecode }: { employeecode: string }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/forgot-password`,
      data: { employeecode: Number(employeecode) },
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
