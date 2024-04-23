import { memo, ReactNode } from "react";
import { useLocation } from "react-router-dom";

import style from "./container.module.scss";

interface ContainerInterface {
  children: ReactNode | JSX.Element;
  className?: string;
}
const Container: React.FC<ContainerInterface> = ({ children, className }) => {
  const { pathname } = useLocation();
  return (
    <div
      className={`${style.container} ${className} ${
        pathname === "/play" || pathname.includes("/project") || pathname.includes("/embed")
          ? style.containerNone
          : ""
      }  `}
    >
      {children}
    </div>
  );
};

export default memo(Container);
