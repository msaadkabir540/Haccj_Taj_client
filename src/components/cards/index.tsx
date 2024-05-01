import { memo } from "react";

import Button from "../button";

import style from "./index.module.scss";

const Cards = ({ name }: { name: string }) => {
  return (
    <>
      <div className={style.box}>
        <div className={style.info}>
          <Button
            title="Click Detail"
            // handleClick={() => setIsUser(true)}
            className={style.btn}
          />
        </div>
      </div>
    </>
  );
};

export default memo(Cards);
