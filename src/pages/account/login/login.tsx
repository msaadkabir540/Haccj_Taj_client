import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Input from "@/components/input";
import Button from "@/components/button";
import createNotification from "@/common/create-notification";

import { LoginFromInterface } from "@/interface/index";

import styles from "./index.module.scss";
import AuthComponent from "../auth-component";
import { signIn } from "@/api-services/auth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
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
        createNotification({ type: "success", message: "Successfully Login" });
        setIsLoading(false);
        navigate("/dashboard");
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
                type={"password"}
                register={register}
                placeholder="Enter Password"
                errorMessage={errorPassword}
              />
              <div className={styles.btnContainer}>
                <Button
                  title={"Sign Up"}
                  type="submit"
                  // loaderClass={styles.loaderClass}
                  className={styles.btn3}
                  handleClick={() => navigate("/sign-up")}
                />
                <Button
                  title={"Login"}
                  type="submit"
                  loaderClass={styles.loaderClass}
                  className={styles.btn}
                  isLoading={isLoading}
                  // disabled={!watch("employeecode") || !watch("password")}
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
            <div className={styles.textAccount}>Don't have an account?</div>
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
