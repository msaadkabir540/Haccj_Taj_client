// contexts/PostsContext.tsx

import React, { useContext, useState, useEffect, createContext } from "react";
import { EmployeeDataInterface } from "./context-interface";
import { getAllEmployees } from "@/api-services/user";

interface ClientContextInterface {
  allEmployees?: EmployeeDataInterface[] | undefined;
  employeeOptions?: { value: string; label: string }[];
}

const ClientContext = createContext<ClientContextInterface | undefined>(undefined);

export const ContextCollection = ({ children }: { children: React.ReactNode }) => {
  const [allEmployees, setAllEmployees] = useState<EmployeeDataInterface[]>();

  const employeeOptions =
    allEmployees?.map((data: any) => ({
      value: data?.employeecode,
      label: data?.name,
    })) || [];

  const handleAllUser = async () => {
    try {
      const response = await getAllEmployees();

      if (response?.status === true) {
        setAllEmployees(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleAllUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextData = {
    allEmployees,
    employeeOptions,
  };

  return <ClientContext.Provider value={contextData}>{children}</ClientContext.Provider>;
};

export const useClients = (): ClientContextInterface | undefined => {
  const context = useContext(ClientContext);
  if (!context) {
    console.error("useClients must be used within a ClientContextProvider");
  }

  return context;
};
