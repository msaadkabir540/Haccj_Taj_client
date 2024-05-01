import { useEffect, useState } from "react";

import { getAllTreacbility } from "@/api-services/treacbility";

import styles from "./index.module.scss";

const Treacbility: React.FC = () => {
  const [getTreacbility, setGetTreacbility] = useState();

  const handleGetTreacbility = async () => {
    try {
      const response = await getAllTreacbility();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetTreacbility();
  }, []);

  return <div className={styles.loading}>Welcome To Treacbility</div>;
};
export default Treacbility;
