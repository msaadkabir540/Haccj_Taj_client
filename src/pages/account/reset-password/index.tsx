import { useForm } from "react-hook-form";
import "jsoneditor-react/es/editor.min.css";
import { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "@/components/input";
import Button from "@/components/button";

import createNotification from "@/common/create-notification";

import AuthComponent from "../auth-component";
import { resetPassword } from "@/api-services/auth";

import EyeIcon from "@/assets/eyeIcon.svg";
import EyeClose from "@/assets/eyeclose.svg";

import { ResetPasswordFromInterface } from "@/interface/index";

import styles from "./index.module.scss";

const ResetPassword: React.FC = () => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFromInterface>({
    defaultValues: {
      password: "",
      password2: "",
    },
  });

  const [loader, setLoader] = useState<boolean>(false);

  const navigate = useNavigate();

  const [notSamePassword, setNotSamePassword] = useState<string>("");

  const onSubmit = async (data: ResetPasswordFromInterface) => {
    if (passwordsMatch) {
      setNotSamePassword("");
      const code = localStorage.getItem("employeecode");
      const resetData = {
        employeecode: Number(code),
        password: data?.password,
      };
      setLoader(true);
      const res = await resetPassword({ data: resetData });
      setLoader(false);
      if (res.status === true) navigate("/login");
      else createNotification({ type: "error", message: res?.message || "Failed To Login." });
    } else {
      setNotSamePassword("Please Enter Same Passoword");
    }
  };

  const passwordsMatch = useMemo(() => {
    const password = watch("password");
    const password2 = watch("password2");
    return password === password2;
  }, [watch("password"), watch("password2")]);

  return (
    <>
      <AuthComponent screenName={"Reset Password"} title="">
        <form onSubmit={handleSubmit(onSubmit)} id="clientForm">
          <div className={styles.activeTab}>
            <div className={styles.inputContainer}>
              <Input
                name="password"
                type={"password"}
                register={register}
                placeholder="Enter Password"
                inputClass={styles.inputClass}
                errorMessage={errors?.password?.message}
              />
              <Input
                name="password2"
                register={register}
                inputClass={styles.inputClass}
                placeholder="Confirm Password"
                type={isShow ? "text" : "password"}
                iconClass={styles.iconsClass}
                icon={isShow ? EyeClose : EyeIcon}
                onClick={() => setIsShow(!isShow)}
                errorMessage={errors?.password?.message}
              />
              <p className={styles.errormessage}>{notSamePassword}</p>
              <div className={styles.btnContainer}>
                <Button
                  title={"Go Back"}
                  className={styles.btn2}
                  handleClick={() => navigate("/login")}
                />
                <Button title={"Submit"} type="submit" isLoading={loader} className={styles.btn} />
              </div>
            </div>
          </div>
        </form>
      </AuthComponent>
    </>
  );
};

export default memo(ResetPassword);
