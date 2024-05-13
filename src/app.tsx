import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import Routing from "@/routes/index";
import Navbar from "./components/navbar";
import Loading from "./components/loading";
import Container from "@/components/container";

import { getAllEmployees } from "./api-services/user";

import { setUsers } from "./reducers";

import logo from "@/assets/assets/taj mahal logo.png";

import style from "./app.module.scss";
import "./app.module.scss";
import Navbars from "./components/navbars";
import { ContextCollection } from "./context/context-collection";

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleAllUser = async () => {
    try {
      const response = await getAllEmployees();
      if (response?.status === true) {
        dispatch(setUsers({ users: response?.data }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      handleAllUser();
    }
  }, []);

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
            <ContextCollection>
              <Navbars />

              <Container>
                <Routing setLoading={setLoading} />
              </Container>
            </ContextCollection>
          </BrowserRouter>
        </div>
      )}
    </>
  );
};

export default Dashboard;
