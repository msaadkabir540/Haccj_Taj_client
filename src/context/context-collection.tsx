// contexts/PostsContext.tsx

import React, { useContext, useState, useEffect, createContext } from "react";
import { EmployeeDataInterface } from "./context-interface";
import { getAllEmployees } from "@/api-services/user";

interface ClientContextInterface {
  allEmployees?: EmployeeDataInterface[] | undefined;
  employeeOptions?: { value: string; label: string }[];
  getUserUsername?: { [key: string]: string };
  loggedInUser?: string | undefined | null;
  loggedInUserName?: string | undefined;
  loggedAdminStatus?: number | null;
  isAdmin?: boolean;
  handleLoggedIn?: any;
}

const ClientContext = createContext<ClientContextInterface | undefined>(undefined);

export const ContextCollection = ({ children }: { children: React.ReactNode }) => {
  const loggedInUser = localStorage?.getItem("employeecode");
  const token = localStorage?.getItem("token");
  const loggedAdminStatus = localStorage?.getItem("admin");
  const [allEmployees, setAllEmployees] = useState<EmployeeDataInterface[]>();
  const [loggedIn, setLoggedIn] = useState<any>();

  const isAdmin = loggedAdminStatus === "1" ? true : false;

  const employeeOptions =
    allEmployees?.map((data: any) => ({
      value: data?.employeecode,
      label: data?.name,
    })) || [];

  const getUserUsername: { [key: string]: string } =
    allEmployees?.reduce((acc: { [key: string]: string }, allEmployees) => {
      acc[allEmployees?.employeecode] = allEmployees.name;
      return acc;
    }, {}) || {};
  const loggedInUserName = getUserUsername[loggedInUser];

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

  const handleLoggedIn = ({ res }: { res: any }) => {
    setLoggedIn(res);
  };

  useEffect(() => {
    if (token) handleAllUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const contextData = {
    handleLoggedIn,
    isAdmin,
    allEmployees,
    loggedInUser,
    employeeOptions,
    loggedInUserName,
    getUserUsername,
    loggedAdminStatus,
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
