import { memo } from "react";

import Button from "../button";

import { useNavigate } from "react-router-dom";

import style from "./index.module.scss";

const Card = ({
  id,
  name,
  imageCards,
  link,
}: {
  id: number;
  link: string;
  name: string;
  imageCards: string;
}) => {
  const navigate = useNavigate();
  return (
    <>
      <article className={style.card}>
        <div className={style.thumb}>
          <img src={imageCards} alt="imageCards" width="150px" />
        </div>
        <div className={style.infos}>
          <h2 className={style.title}>{name}</h2>
          {/* <h3 className={style.date}>november 2 - 4</h3> */}
          {/* <h3 className={style.seats}> */}
          <div className={style.seats}>
            <Button
              title="More Detail"
              handleClick={() => navigate(`/${link}`)}
              className={style.btn}
            />
          </div>
          {/* </h3> */}
        </div>
      </article>
    </>
  );
};

export default memo(Card);
