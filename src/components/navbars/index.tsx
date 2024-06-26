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
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [isLogout, setIsLogout] = useState<boolean>(false);

  const context = useClients();
  const loggedAdminStatus = context ? context?.loggedAdminStatus : "";
  const loggedInUserName = context ? context?.loggedInUserName : "";
  const isAdmin = loggedAdminStatus === "1" ? true : false;

  const linksToRender = isAdmin ? pageNameWithLink : notAdminPageNameWithLink;

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
  const handleOpen = () => setOpen(!open);

  return (
    <>
      <div className={styles.navbar} style={{ display: `${showNav(pathname)}` }}>
        <div className={styles.listDiv}>
          <div className={styles.navLogo}>
            <div>
              <Link to="/" className={styles.link}>
                <img src={logo} alt="Haccj Taj" />
              </Link>
            </div>
          </div>

          <div className={styles.menuListData}>
            <div className={styles.navItems}>
              <div>
                {linksToRender?.map((navbarList) => {
                  return (
                    <Link
                      className={pathname === navbarList?.link ? styles.activeTab : ""}
                      key={navbarList?.id}
                      to={navbarList?.link}
                    >
                      {navbarList?.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            {isAdmin && (
              <div className={styles.dropDownClass} onClick={handleOpen}>
                <div className={styles.marginLeft}>
                  Add Catagory{" "}
                  <span style={{ color: "#438afe" }}>{value ? ` : ${value}` : ""}</span>
                  {value && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 14 14"
                      fill="none"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("");
                      }}
                    >
                      <path
                        d="M1.00392 0.649759C0.831829 0.6498 0.663661 0.696866 0.520917 0.784941C0.378172 0.873015 0.267336 0.998095 0.20258 1.14419C0.137823 1.29028 0.122089 1.45075 0.157387 1.60509C0.192685 1.75942 0.277413 1.9006 0.400737 2.01057L5.84459 6.99869L0.400737 11.9868C0.317714 12.0598 0.251429 12.1473 0.205767 12.2441C0.160104 12.3409 0.135981 12.4451 0.13481 12.5506C0.133639 12.656 0.155444 12.7606 0.198948 12.8583C0.242451 12.9559 0.306779 13.0446 0.388164 13.1192C0.469549 13.1937 0.566354 13.2527 0.672911 13.2925C0.779467 13.3324 0.893633 13.3524 1.00872 13.3513C1.12381 13.3502 1.23751 13.3281 1.34316 13.2863C1.44881 13.2445 1.54429 13.1837 1.624 13.1077L7.06785 8.11954L12.5117 13.1077C12.5914 13.1837 12.6869 13.2445 12.7925 13.2863C12.8982 13.3281 13.0119 13.3502 13.127 13.3513C13.2421 13.3524 13.3562 13.3324 13.4628 13.2926C13.5693 13.2527 13.6662 13.1937 13.7475 13.1192C13.8289 13.0446 13.8933 12.9559 13.9368 12.8583C13.9803 12.7606 14.0021 12.656 14.0009 12.5506C13.9997 12.4451 13.9756 12.3409 13.9299 12.2441C13.8843 12.1473 13.818 12.0598 13.735 11.9868L8.29111 6.99869L13.735 2.01057C13.86 1.89924 13.9453 1.75589 13.9799 1.59933C14.0145 1.44277 13.9966 1.28029 13.9287 1.13318C13.8607 0.986078 13.7459 0.861213 13.5992 0.774949C13.4524 0.688686 13.2807 0.64505 13.1064 0.649759C12.8817 0.655895 12.6684 0.74196 12.5117 0.889721L7.06785 5.87783L1.624 0.889721C1.54338 0.813789 1.44698 0.753433 1.34047 0.712218C1.23397 0.671003 1.11953 0.649765 1.00392 0.649759Z"
                        fill="#2A2E34"
                      />
                    </svg>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                  >
                    <path
                      d="M1.8418 1.5L6.92085 6.5L11.9999 1.5"
                      stroke="#2A2E34"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                {open && (
                  <div className={styles.menu}>
                    {pageNameWithLinkOption?.map((data) => (
                      <Link
                        className={pathname === data?.value ? styles.activeTab : ""}
                        key={data?.value}
                        to={data?.value}
                      >
                        <div
                          key={data?.label}
                          onClick={() => setValue(data?.label)}
                          className={styles.menuList}
                        >
                          {data?.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
                {linksToRender?.map((navbarList) => {
                  return (
                    <li key={navbarList?.id} onClick={() => setShowMobileMenu(false)}>
                      <Link to={navbarList?.link}>{navbarList?.name}</Link>
                    </li>
                  );
                })}

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

const pageNameWithLink = [
  {
    id: 1,
    name: "Dashboard",
    link: "/",
  },
  {
    id: 2,
    name: "Employees",
    link: "/user",
  },
];

const pageNameWithLinkOption = [
  {
    label: "Add Trasability Product",
    value: "/products",
  },
  {
    label: "Add Temperature Equipment",
    value: "/equipment",
  },
  {
    label: "Add Product Name",
    value: "/product-name",
  },
  {
    label: "Add Oil Temperature Machine",
    value: "/machine",
  },
];

const notAdminPageNameWithLink = [
  {
    id: 1,
    name: "Dashboard",
    link: "/",
  },
];
