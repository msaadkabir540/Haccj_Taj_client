import { axiosApiRequest } from "@/utils/api";

import { LoginFromInterface } from "@/interface/account-interface";

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
  } catch (e) {
    console.error(e);
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
