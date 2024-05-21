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

/////
//  Get product name

export const getProductName = async () => {
  try {
    const response = await axiosApiRequest({
      method: "get",
      url: `/get-trasability-productName`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const addProductName = async ({
  data,
}: {
  data: { employeecode: number; product_name: string };
}) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/add-trasability-productName`,
      data: { employeecode: Number(data?.employeecode), product_name: data?.product_name },
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const deleteProductName = async ({ id }: { id: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "delete",
      url: `/delete-trasability-productName/${id}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

//

// product

export const getProducts = async ({ data }: { data: any }) => {
  try {
    const response = await axiosApiRequest({
      method: "post",
      url: `/get-productsData`,
      data,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

// export const addProducts = async ({
//   data,
// }: {
//   data: { employeecode: number; product_name: string };
// }) => {
//   try {
//     const response = await axiosApiRequest({
//       method: "post",
//       url: `/update-ProductsData`,
//       data: { employeecode: Number(data?.employeecode), product_name: data?.product_name },
//     });

//     return response;
//   } catch (e) {
//     console.error(e);
//   }
// };
export const deleteProducts = async ({ id }: { id: number }) => {
  try {
    const response = await axiosApiRequest({
      method: "delete",
      url: `/delete-productsData/${id}`,
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};
