import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import Routing from "@/routes/index";
import Navbar from "./components/navbar";
import Loading from "./components/loading";
import Container from "@/components/container";

import logo from "@/assets/assets/taj mahal logo.png";

import style from "./app.module.scss";

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // const handleGetAllClients = async () => {
  //   try {
  //     const response = await getAllClients({
  //       params: { sortOrder: "asc", sortBy: "name" },
  //     });
  //     if (response.status === 200) {
  //       dispatch(setAllClientsInStore({ clients: response?.data?.allClients }));
  //     } else {
  //       throw new Error("Failed to fetch clients!");
  //     }
  //   } catch (error: any) {
  //     console.error({ error: error?.message });
  //   }
  // };

  // const handleGetAllUsers = async () => {
  //   try {
  //     const res: any = await getAllUsers({
  //       params: {
  //         clientId: selectedClient,
  //       },
  //     });
  //     if (res.status == 200) {
  //       dispatch(setUsers(res?.data?.users));
  //     } else {
  //       createNotification("error", res?.data?.error || "Failed", 5000);
  //     }
  //   } catch (err) {
  //     console.error("err", err);
  //   }
  // };

  // const getUser = async () => {
  //   const res = await getUserById();
  //   dispatch(addLoggedInUser({ loggedInUser: res.data }));
  //   res?.data?.clientId && dispatch(selectedClientOptions(res?.data?.clientId));
  //   res?.data?.client && dispatch(setCurrentClient(res?.data?.client));
  // };

  // const effect = async () => {
  //   if (!clients?.length || loggedInUser === null) {
  //     setLoading(true);
  //     loggedInUser === null && (await getUser());
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // if (loggedInUser?.message !== "No token provided!" && localStorage.getItem("token")) effect();
  }, []);

  // useEffect(() => {
  //   selectedClient !== null && handleGetAllUsers();
  // }, [selectedClient]);

  return (
    <>
      {loading ? (
        <div className={style.loading}>
          <img src={logo} alt="peersuma-logo" width="150px" />
          <Loading loaderClass={style.loader} />
        </div>
      ) : (
        <div className="App">
          <BrowserRouter>
            <Navbar />
            <Container>
              <Routing setLoading={setLoading} />
            </Container>
          </BrowserRouter>
        </div>
      )}
    </>
  );
};

export default Dashboard;
