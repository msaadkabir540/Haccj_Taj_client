import { memo } from "react";
import { PermissionRestrictInterface } from "./permission-interface";

const PermissionRestrict: React.FC<PermissionRestrictInterface> = ({ children }) => {
  return <>{children}</>;
};

export default memo(PermissionRestrict);
