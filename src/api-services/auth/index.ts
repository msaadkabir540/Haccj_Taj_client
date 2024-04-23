import { axiosApiRequest } from "@/utils/api";

import { LoginFromInterface } from "@/interface/account-interface";

export const signIn = async ({ data }: { data: LoginFromInterface }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/login`,
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
