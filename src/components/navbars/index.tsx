import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// --- Context & Helpers ---
import { useClients } from "@/context/context-collection";
import { useOutsideClickHook } from "@/utils/helper";

// --- Components ---
import Button from "../button";
import Modal from "../modal";

// --- Assets & Styles ---
import logo from "@/assets/assets/taj-mahal-logo.png";
import styles from "./index.module.scss";

// --- Icon Components (New) ---
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 14 9" fill="none">
    <path
      d="M1.5 1.5L7 7L12.5 1.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon = () => (
  <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
  </svg>
);

const HamburgerIcon = () => (
  <div className={styles.hamburgerLineWrapper}>
    {" "}
    <div />
    <div />
    <div />{" "}
  </div>
);
const CloseIcon = () => <div className={styles.closeIcon}>&times;</div>;

// --- Main Component ---
const Navbars = () => {
  const navbarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  const context = useClients();
  const loggedAdminStatus = context?.loggedAdminStatus;
  const loggedInUserName = context?.loggedInUserName;
  const isAdmin = loggedAdminStatus === ("1" as any);

  const linksToRender = isAdmin ? pageNameWithLink : notAdminPageNameWithLink;

  // Effect to close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect to manage body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  // Hook to close dropdown when clicking outside
  useOutsideClickHook(navbarRef, () => setIsDropdownOpen(false));

  const handleLogout = () => {
    localStorage.clear();
    setIsLogoutModalOpen(false);
    navigate(`/login`);
  };

  const handleCategorySelect = (category: { label: string; value: string }) => {
    setSelectedCategory(category.label);
    setIsDropdownOpen(false); // Close dropdown on selection
    setIsMobileMenuOpen(false); // Close mobile menu on selection
  };

  // Function to close menus on main link navigation
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setSelectedCategory(""); // Reset category when navigating to main pages
  };

  return (
    <>
      <nav ref={navbarRef} className={styles.navbar} style={{ display: showNav(pathname) }}>
        <div className={`${styles.navContent}`}>
          <Link to="/" className={styles.navLogo} onClick={handleNavClick}>
            <img src={logo} alt="Haccj Taj Logo" />
          </Link>

          {/* --- Desktop Navigation --- */}
          <div className={styles.desktopNav}>
            <div className={styles.navLinks}>
              {linksToRender.map((navLink) => (
                <Link
                  key={navLink.id}
                  to={navLink.link}
                  className={pathname === navLink.link ? styles.active : ""}
                  onClick={handleNavClick}
                >
                  {navLink.name}
                </Link>
              ))}
            </div>

            {isAdmin && (
              <div className={styles.dropdownContainer}>
                <button
                  className={styles.dropdownToggle}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>
                    Add Category
                    {selectedCategory && (
                      <span className={styles.selectedValue}>: {selectedCategory}</span>
                    )}
                  </span>
                  <ChevronDownIcon />
                </button>
                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    {pageNameWithLinkOption.map((item) => (
                      <Link
                        key={item.value}
                        to={item.value}
                        className={pathname === item.value ? styles.activeDropdownItem : ""}
                        onClick={() => handleCategorySelect(item)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.userActions}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{loggedInUserName}</span>
              <button
                title="Logout"
                className={styles.logoutButton}
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <UserIcon />
              </button>
            </div>
            <button className={styles.hamburgerButton} onClick={() => setIsMobileMenuOpen(true)}>
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Navigation Menu --- */}
      <div
        className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.visible : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ""}`}>
        <div className={styles.mobileMenuHeader}>
          <span>Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.mobileNavLinks}>
          {linksToRender.map((navLink) => (
            <Link key={navLink.id} to={navLink.link} onClick={handleNavClick}>
              {navLink.name}
            </Link>
          ))}
          {isAdmin && (
            <div className={styles.mobileDropdown}>
              <p className={styles.mobileDropdownTitle}>Add Category</p>
              <div className={styles.mobileDropdownList}>
                {pageNameWithLinkOption.map((item) => (
                  <Link key={item.value} to={item.value} onClick={() => handleCategorySelect(item)}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className={styles.mobileLogoutSection}>
            <p>{loggedInUserName}</p>
            <Button
              title="Logout"
              handleClick={() => setIsLogoutModalOpen(true)}
              className={styles.mobileLogoutButton}
            />
          </div>
        </div>
      </div>

      {/* --- Logout Confirmation Modal --- */}
      {isLogoutModalOpen && (
        <Modal open={isLogoutModalOpen} className={styles.modalWrapper}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>
              <UserIcon />
            </div>
            <h4>Are you sure you want to logout?</h4>
            <div className={styles.modalActions}>
              <Button
                titleStyles={{ color: "white" }}
                title="Logout"
                handleClick={handleLogout}
                className={styles.confirmBtn}
              />
              <Button
                title="Cancel"
                handleClick={() => setIsLogoutModalOpen(false)}
                className={styles.cancelBtn}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Navbars;

// --- Helper Data & Functions (Keep these as they are) ---
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
  { id: 1, name: "Dashboard", link: "/" },
  { id: 2, name: "Employees", link: "/user" },
  { id: 2, name: "Attendance", link: "/attendance" },
  { id: 2, name: "Notification", link: "/scheduled-notifications" },
];
const notAdminPageNameWithLink = [{ id: 1, name: "Dashboard", link: "/" }];
const pageNameWithLinkOption = [
  { label: "Add Product Name", value: "/product-name" },
  { label: "Add Trasability Product", value: "/products" },
  { label: "Add Temperature Equipment", value: "/equipment" },
  { label: "Add Oil Temperature Machine", value: "/machine" },
  { label: "Add Production Product Type", value: "/products-type-catagory" },
  { label: "Add Production Product Name", value: "/production-products-name" },
];
