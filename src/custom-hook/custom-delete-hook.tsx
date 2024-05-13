import { useState, useEffect } from "react";

import { useState } from "react";

type DeletedData = {
  [key: string]: string | number;
}[];

const useDeleteEmployee = ({
  deletedData,
  deleteId,
}: {
  deletedData: DeletedData;
  deleteId: string;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatedData, setUpdatedData] = useState<DeletedData[]>([]);

  const handleDelete = async ({ deleteId }: { deleteId: string }) => {
    setIsDeleting(true);
    try {
      // Perform deletion operation (replace this with your deleteEmployee function)
      // const res = await deleteEmployee({ id: deleteId });
      // if (res.status === true) {
      // Simulating successful deletion
      const updatedData = deletedData?.filter((item) => item.id !== deleteId);
      setUpdatedData(updatedData);
      setIsDeleting(false);
      // createNotification({ type: "success", message: res?.message });
      // }
    } catch (error) {
      console.error(error);
    }
  };

  return { isDeleting, updatedData, handleDelete };
};

export default useDeleteEmployee;
