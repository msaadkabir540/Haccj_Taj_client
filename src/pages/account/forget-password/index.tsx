import { useForm } from "react-hook-form";
import "jsoneditor-react/es/editor.min.css";
import React, { memo, useState } from "react";

import Input from "@/components/input";
import Button from "@/components/button";

import createNotification from "@/common/create-notification";

import { ForgotPassWordFormInterface } from "@/interface/index";

import styles from "./index.module.scss";
import AuthComponent from "../auth-component";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPassWordFormInterface>({
    defaultValues: {
      email: "",
    },
  });

  const [loader, setLoader] = useState<boolean>(false);

  const onSubmit = async (data: ForgotPassWordFormInterface) => {
    // setLoader(true);
    // const res = await forgotPassword({ data: data });
    // setLoader(false);
    // if (res.status === 200) createNotification("success", "Reset password link sent to email");
    // else createNotification("error", res?.data?.message || "Failed To Login.", 5000);
  };

  return (
    <>
      <AuthComponent screenName={"Forget Password"} title="">
        <form onSubmit={handleSubmit(onSubmit)} id="clientForm">
          <div className={styles.activeTab}>
            <div className={styles.inputContainer}>
              <Input
                name="email"
                register={register}
                placeholder="Enter Email"
                inputClass={styles.inputClass}
                errorMessage={errors?.email?.message}
              />
              <div className={styles.btnContainer}>
                <Button
                  title={"Go Back"}
                  className={styles.btn2}
                  handleClick={() => navigate("/login")}
                  isLoading={loader}
                />
                <Button
                  title={"Send Password Reset Link"}
                  type="submit"
                  className={styles.btn}
                  disabled={!watch("email")}
                  isLoading={loader}
                />
              </div>
            </div>
          </div>
        </form>
      </AuthComponent>
    </>
  );
};

export default memo(ForgotPassword);
