import { useRef, useState, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import PermissionRestrict from "../permission-restrict";

import logo from "@/assets/assets/taj-mahal-logo.png";

import "react-dropdown/style.css";

import styles from "./index.module.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [navbar, setNavbar] = useState({ show: "none", action: false });

  const handleLogout = () => {
    // Clear Local Storage
    localStorage.clear();
    setNavbar((prev) => ({ ...prev, action: false }));
    navigate(`/login`);
  };

  return (
    <div className={styles.main} style={{ display: `${showNav(pathname)}` }}>
      <div className={styles.title}>
        <div>
          <Link to="/" className={styles.link}>
            <img src={logo} alt="Haccj Taj" />
          </Link>
        </div>
        <div className={styles.listLink}>
          <div className={styles.listsLink}>
            {navTabs?.map(({ title, route, match }, index) => (
              <PermissionRestrict key={index}>
                <Link
                  to={route}
                  className={
                    match.some((x) => pathname.includes(x)) || route === pathname
                      ? styles.active
                      : styles.tab
                  }
                >
                  {title}
                </Link>
              </PermissionRestrict>
            ))}
          </div>
          <div>
            <div className={styles.dropdown}>
              <button className={styles.dropbtn}>Add Spicing</button>
              <div className={styles["dropdown-content"]}>
                <Link to={"/products"} className={styles.links}>
                  Add Products
                </Link>
                <Link to={"/equipment"} className={styles.links}>
                  Add Equipments
                </Link>
                <Link to={"/checklist"} className={styles.links}>
                  Add checklist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.pages}>
        <div title="Logout" className={styles.logoutDiv}>
          <svg
            className={styles.logout}
            onClick={() => handleLogout()}
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default memo(Navbar);

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

const navTabs = [
  { title: "Dashboard", route: "/", match: ["dashboard"] },
  { title: "User", route: "/user", match: ["user"] },
];
