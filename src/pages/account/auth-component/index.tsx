import React from "react";

import WaysShapes from "./ways-shap";
import AuthImage from "@/assets/assets/taj-mahal-logo.png";

import styles from "./index.module.scss";

const AuthComponent = ({
  children,
  screenName,
  title,
}: {
  screenName: string;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className={` ${styles.container} `}>
        <div className={`${styles.mainContainer}`}>
          <div className={`  ${styles.leftContainer}`}>
            <div className={`  ${styles.headerContainer}`}>
              <div className={`  ${styles.textContainer}`}>
                <div className={styles.mainImage}>
                  <img src={AuthImage} alt={"button icon"} width={"170px"} />
                </div>
                <div className={styles.mainHeading}>{screenName}</div>
                <div className={`${styles.titleClass}`}>{title}</div>
              </div>
            </div>
            <div>{children}</div>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.wave}></div>
          <WaysShapes />

          <div className={styles.logoImage}></div>
        </div>
      </div>
    </>
  );
};

export default AuthComponent;
