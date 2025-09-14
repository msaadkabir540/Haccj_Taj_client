import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, useNavigate } from "react-router-dom";

import Routing from "@/routes/index";
import Navbar from "./components/navbar";
import Navbars from "./components/navbars";
import Loading from "./components/loading";
import Container from "@/components/container";

import { getAllEmployees } from "./api-services/user";

import { setUsers } from "./reducers";

import logo from "@/assets/assets/taj mahal logo.png";

import { ContextCollection } from "./context/context-collection";

import "./app.module.scss";
import style from "./app.module.scss";

const Dashboard = () => {
  // const navigate = useNavigate();
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

// import { useDispatch } from "react-redux";
// import { useEffect, useState } from "react";
// import { BrowserRouter } from "react-router-dom";

// import Routing from "@/routes/index";
// import Navbars from "./components/navbars";
// import Loading from "./components/loading";
// import Container from "@/components/container";

// import { getAllEmployees } from "./api-services/user";
// import { setUsers } from "./reducers";

// import logo from "@/assets/assets/taj mahal logo.png";
// import { ContextCollection } from "./context/context-collection";

// import style from "./app.module.scss";

// import { bindFcmToEmployee, setupForegroundMessageHandler, clearFcmTokenCache } from "./firebase";

// import "tailwindcss";

// const Dashboard = () => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [fcmInitialized, setFcmInitialized] = useState<boolean>(false);
//   const dispatch = useDispatch();

//   const handleAllUser = async () => {
//     try {
//       setLoading(true);
//       const response = await getAllEmployees();
//       if (response?.status === true) {
//         dispatch(setUsers({ users: response?.data }));
//       }
//     } catch (error) {
//       console.error("Error fetching employees:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initialize FCM for the logged-in user
//   const initializeFcmForUser = async (employeeCode: string) => {
//     if (!employeeCode || fcmInitialized) return;

//     try {
//       console.log("Initializing FCM for employee:", employeeCode);
//       const token = await bindFcmToEmployee(employeeCode);

//       if (token) {
//         console.log("FCM successfully initialized with token:", token);
//         setFcmInitialized(true);

//         // Setup foreground message handler
//         setupForegroundMessageHandler();
//       } else {
//         console.warn("FCM initialization failed");
//       }
//     } catch (error) {
//       console.error("Failed to initialize FCM:", error);
//     }
//   };

//   // Handle user logout - clear FCM token cache
//   const handleLogout = () => {
//     const employeeCode = localStorage.getItem("employeecode");
//     if (employeeCode) {
//       clearFcmTokenCache(employeeCode);
//     }
//     setFcmInitialized(false);
//   };

//   // Main initialization effect
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const employeeCode = localStorage.getItem("employeecode");

//     if (!token) {
//       console.log("No auth token found, skipping initialization");
//       return;
//     }

//     // Fetch all employees data
//     handleAllUser();

//     // Initialize FCM if employee code is available
//     if (employeeCode) {
//       initializeFcmForUser(employeeCode);
//     } else {
//       console.warn("No employee code found, FCM not initialized");
//     }
//   }, []);

//   // Listen for custom FCM messages (optional)
//   useEffect(() => {
//     const handleFcmMessage = (event: CustomEvent) => {
//       const payload = event.detail;
//       console.log("Received FCM message in app:", payload);

//       // Handle the message in your app (show toast, update state, etc.)
//       // Example: show a toast notification
//       // toast.success(payload.notification?.title || 'New notification');
//     };

//     window.addEventListener("fcm-message", handleFcmMessage as EventListener);

//     return () => {
//       window.removeEventListener("fcm-message", handleFcmMessage as EventListener);
//     };
//   }, []);

//   // Expose logout handler globally if needed
//   useEffect(() => {
//     (window as any).handleFcmLogout = handleLogout;

//     return () => {
//       delete (window as any).handleFcmLogout;
//     };
//   }, []);

//   return (
//     <>
//       {loading ? (
//         <div className={style.loading}>
//           <img src={logo} alt="peersuma-logo" width="150px" />
//           <Loading loaderClass={style.loader} />
//         </div>
//       ) : (
//         <div className="App">
//           <BrowserRouter>
//             <ContextCollection>
//               <Navbars />
//               <Container>
//                 <Routing setLoading={setLoading} />
//               </Container>
//             </ContextCollection>
//           </BrowserRouter>
//         </div>
//       )}
//     </>
//   );
// };

// export default Dashboard;
