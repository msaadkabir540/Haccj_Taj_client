import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useClients } from "@/context/context-collection";

import logo from "@/assets/assets/taj-mahal-logo.png";

import styles from "./index.module.scss";
import Button from "../button";
import Modal from "../modal";

const Navbars = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [navbar, setNavbar] = useState({ show: "none", action: false });
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [isLogout, setIsLogout] = useState<boolean>(false);

  const context = useClients();
  const loggedAdminStatus = context ? context?.loggedAdminStatus : "";
  const loggedInUserName = context ? context?.loggedInUserName : "";
  const isAdmin = loggedAdminStatus === "1" ? true : false;

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 770) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    // Clear Local Storage
    localStorage.clear();
    setIsLogout(false);
    setNavbar((prev) => ({ ...prev, action: false }));
    navigate(`/login`);
  };

  return (
    <>
      <div className={styles.navbar} style={{ display: `${showNav(pathname)}` }}>
        <div className={styles.navLogo}>
          <div>
            <Link to="/" className={styles.link}>
              <img src={logo} alt="Haccj Taj" />
            </Link>
          </div>
        </div>
        <div className={styles.navItems}>
          <div>
            <Link to="/">Dashboard</Link>
            {isAdmin && (
              <>
                <Link to="/user">Employees</Link>
                <Link to="/products">Add Trasability Product</Link>
                {/* <Link to="/checklist">Add Checklist</Link> */}
                <Link to="/equipment">Add Temperature Equipment</Link>
                <Link to="/machine">Add Oil Temperature Machine</Link>
              </>
            )}
          </div>
        </div>

        <div className={styles.pages}>
          <div>{loggedInUserName}</div>
          <div title="Logout" className={styles.logoutDiv}>
            <svg
              className={styles.logout}
              onClick={() => setIsLogout(true)}
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
            </svg>
          </div>
        </div>

        <div className={styles.hamburgerMenu} onClick={toggleMobileMenu}>
          &#9776;
        </div>
      </div>

      {showMobileMenu && (
        <div className={`${styles.mobileMenu} ${showMobileMenu ? styles.animation : ""}`}>
          <div className={styles.hamburgerCross} onClick={toggleMobileMenu}>
            &#10006;
          </div>

          <div className={styles.mobileNavItems}>
            <div className={styles.ListMenu}>
              <ul>
                <li onClick={() => setShowMobileMenu(false)}>
                  <Link to="/">Dashboard</Link>
                </li>
                {isAdmin && (
                  <>
                    <li onClick={() => setShowMobileMenu(false)}>
                      <Link to="/user">Employees</Link>
                    </li>
                    <li onClick={() => setShowMobileMenu(false)}>
                      <Link to="/products">Add Trasability Product</Link>
                    </li>
                    <li onClick={() => setShowMobileMenu(false)}>
                      <Link to="/equipment">Add Temperature Equipment</Link>
                    </li>
                    <li onClick={() => setShowMobileMenu(false)}>
                      <Link to="/machine">Add Oil Temperature Machine</Link>
                    </li>
                  </>
                )}

                <li onClick={() => setShowMobileMenu(false)}>
                  Logout
                  <svg
                    onClick={() => setIsLogout(true)}
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                  </svg>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {isLogout && (
        <Modal
          {...{
            open: isLogout ? true : false,
          }}
          className={styles.modalWrapper}
        >
          <div className={styles.mainModal}>
            <div className={styles.logoutDivModal}>
              <svg
                className={styles.logout}
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
            </div>
            <div className={styles.mainHeading}>Are You Sure to Logout</div>

            <div className={styles.btnClass}>
              <Button title={`Logout`} handleClick={() => handleLogout()} className={styles.btn2} />
              <Button
                title={`Cancel`}
                handleClick={() => setIsLogout(false)}
                className={styles.btn}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Navbars;

const pagesWithoutNavbar = [
  "/login",
  "/sign-up",
  "/authentication",
  "/forgot-password",
  "/password-reset",
];

const showNav = (pathname: string) =>
  pagesWithoutNavbar.includes(pathname) ||
  /^\/(password-reset|showcase|embed|player|album-media-upload)\//.test(pathname)
    ? "none"
    : "flex";
