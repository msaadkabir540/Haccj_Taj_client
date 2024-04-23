import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Input from "@/components/input";
import Button from "@/components/button";
import createNotification from "@/common/create-notification";

import { LoginFromInterface } from "@/interface/index";

import styles from "./index.module.scss";
import AuthComponent from "../auth-component";
import { signUp } from "@/api-services/auth";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFromInterface>({
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    // setIsLoading(true);
    createNotification({ type: "info", message: "Coming Soon" });
    // const res = await signUp({ data });
    // if (res.status === true) {
    //   setIsLoading(false);
    //   navigate("/dashboard");
    // } else {
    //   setIsLoading(false);
    //   createNotification({
    //     type: "error",
    //     message: res?.message || "Failed To Login.",
    //   });
    // }
  };

  return (
    <>
      <AuthComponent screenName={"Create Your Account"} title="Sign up to get your account">
        <form onSubmit={handleSubmit(onSubmit)} id="clientForm">
          <div className={styles.activeTab}>
            <div className={styles.inputContainer}>
              <Input
                inputClass={styles.inputClass}
                type="number"
                name="employeecode"
                register={register}
                placeholder="Enter Your Employee Code"
                errorMessage={errors?.employeecode?.message}
              />
              <Input
                inputClass={styles.inputClass}
                name="password"
                type={"password"}
                register={register}
                placeholder="Enter Password"
                errorMessage={errors?.password?.message}
              />
              <div className={styles.btnContainer}>
                <Button
                  title={"Sign Up"}
                  type="submit"
                  loaderClass={styles.loaderClass}
                  className={styles.btn}
                  isLoading={isLoading}
                  // disabled={!watch("employeecode") || !watch("password")}
                />

                {/* <div className={styles.signUpContainer}>
                  <div>Already have an account?</div>
                  <div className={styles.signUpClass}>
                    <span
                      className={styles.GotoBack}
                      onClick={() => {
                        navigate("/login");
                      }}
                    >
                      Login
                    </span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className={styles.signUPImageBtn}>
            <div className={styles.textAccount}>Already have an account?</div>
            <Button
              title={"Login"}
              type="submit"
              className={styles.btn2}
              handleClick={() => navigate("/login")}
            />
          </div>
        </form>
      </AuthComponent>
    </>
  );
};

export default SignUp;
