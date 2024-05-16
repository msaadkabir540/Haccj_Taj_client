import Card from "@/components/card";
// import Cards from "@/components/cards";

import audit from "@/assets/assets/product.png";
import Oil from "@/assets/assets/oil.png";
import checkList from "@/assets/assets/checklist.png";
import Cleaning from "@/assets/assets/mop.png";
import thermometer from "@/assets/assets/thermometer.png";

import styles from "./index.module.scss";

const Home: React.FC = () => {
  return (
    <div>
      <div className={styles.mainContainer}>
        {data?.map(({ id, name, imageCards, link }) => (
          <Card key={id} id={id} name={name} link={link} imageCards={imageCards} />
        ))}
        {/* <Cards name={"Temperature"} /> */}
      </div>
    </div>
  );
};
export default Home;

const data = [
  { id: 1, link: "temperature", name: "Temperature", imageCards: thermometer },
  { id: 2, link: "treacbility", name: "Trasability", imageCards: audit },
  { id: 3, link: "checklist", name: "Check List", imageCards: checkList },
  { id: 5, link: "oil-temperature", name: "Oil Temperature", imageCards: Oil },
  { id: 4, link: "cleaning-plan", name: "Cleaning Plan", imageCards: Cleaning },
];
