import { axiosApiRequest } from "@/utils/api";

export const getProductTypes = async () => {
  try {
    const response = await axiosApiRequest({
      method: "get",
      url: `/get-trasability-productType`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const addProductType = async ({
  data,
}: {
  data: { employeecode: number; product_type: string };
}) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/add-trasability-productType`,
      data: { employeecode: Number(data?.employeecode), product_type: data?.product_type },
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const deleteProduct = async ({ id }: { id: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "delete",
      url: `/delete-trasability-product/${id}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
