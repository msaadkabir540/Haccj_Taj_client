import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Input from "@/components/input";
import Button from "@/components/button";
import createNotification from "@/common/create-notification";

import { LoginFromInterface } from "@/interface/index";

import EyeIcon from "@/assets/eyeIcon.svg";
import EyeClose from "@/assets/eyeclose.svg";

import AuthComponent from "../auth-component";
import { signIn } from "@/api-services/auth";

import styles from "./index.module.scss";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [errorPassword, setErrorPassword] = useState<string>("");

  const { register, handleSubmit } = useForm<LoginFromInterface>({
    defaultValues: {
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    if (data?.employeecode.trim().length === 0 && data?.password.trim().length === 0) {
      setError("Employee code is required");
      setErrorPassword("password is required");
    } else {
      setError("");
      setErrorPassword("");
      setIsLoading(true);
      const res = await signIn({ data });

      if (res.status === true) {
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("employeecode", res?.employee?.employeecode);
        createNotification({ type: "success", message: "Successfully Login" });

        setIsLoading(false);
        navigate("/");
      } else {
        setIsLoading(false);
        createNotification({
          type: "error",
          message: res?.response?.data?.message || "Failed To Login.",
        });
      }
    }
  };

  return (
    <>
      <AuthComponent screenName={"Login"} title="Get into your account">
        <form onSubmit={handleSubmit(onSubmit)} id="clientForm">
          <div className={styles.activeTab}>
            <div className={styles.inputContainer}>
              <Input
                inputClass={styles.inputClass}
                type="number"
                name="employeecode"
                register={register}
                placeholder="Enter User Employee Code"
                errorMessage={error}
              />
              <Input
                inputClass={styles.inputClass}
                name="password"
                type={isShow ? "text" : "password"}
                register={register}
                placeholder="Enter Password"
                errorMessage={errorPassword}
                iconClass={styles.iconsClass}
                icon={isShow ? EyeClose : EyeIcon}
                onClick={() => setIsShow(!isShow)}
              />
              <div className={styles.btnContainer}>
                <Button
                  title={"Login"}
                  type="submit"
                  loaderClass={styles.loaderClass}
                  className={styles.btn}
                  isLoading={isLoading}
                />
                <Button
                  title={"Sign Up"}
                  type="submit"
                  className={styles.btn3}
                  handleClick={() => navigate("/sign-up")}
                />

                <div
                  className={styles.forgetPassword}
                  onClick={() => {
                    navigate("/forgot-password");
                  }}
                >
                  Forgot password?
                </div>
              </div>
            </div>
          </div>
          <div className={styles.signUPImageBtn}>
            <div className={styles.textAccount}>{`Don't have an account?`}</div>
            <Button
              title={"Sign Up"}
              type="submit"
              className={styles.btn2}
              handleClick={() => navigate("/sign-up")}
            />
          </div>
        </form>
      </AuthComponent>
    </>
  );
};

Login.defaultProps = {};

export default Login;
