import React from "react";

import styles from "./index.module.scss";

const HeadingText = ({ heading, text }: { heading: string; text: string }) => {
  return (
    <div className={styles.header}>
      <div className={styles.heading}>{heading}</div>
      <div className={styles.text}>
        <div className={styles.line}></div>
        {text}
      </div>
    </div>
  );
};

export default HeadingText;
