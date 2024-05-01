import OtpInput from "react-otp-input";
import { useForm } from "react-hook-form";
import "jsoneditor-react/es/editor.min.css";
import React, { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Modal from "@/components/modal";
import Input from "@/components/input";
import Button from "@/components/button";
import AuthComponent from "../auth-component";

import { forgotPassword } from "@/api-services/auth";

import createNotification from "@/common/create-notification";

import { ForgotPassWordFormInterface } from "@/interface/index";

import styles from "./index.module.scss";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPassWordFormInterface>({
    defaultValues: {
      employeecode: "",
    },
  });
  const [code, setCode] = useState("");
  const [loader, setLoader] = useState<boolean>(false);
  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [timer1, setTimer1] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const onSubmit = async (data: ForgotPassWordFormInterface) => {
    setLoader(true);
    if (data?.employeecode === "") {
      setError("Required");
    } else {
      setError("");

      const res = await forgotPassword({ employeecode: data?.employeecode });
      setLoader(false);
      if (res.status === true) {
        localStorage.setItem("otp", res?.data?.otp);
        localStorage.setItem("employeecode", res?.data?.employeecode);
        setIsOTP(true);
        handleStart();
        setLoader(false);
      } else {
        createNotification({ type: "error", message: res?.data?.message || "Error" });
      }
    }
  };

  const handleChange = (code: string) => setCode(code);

  const handleOtpSubmit = () => {
    if (code?.trim()?.length === 0) {
      setOtpError("Please Enter OTP");
    } else {
      setOtpError("");
      const Opt = localStorage.getItem("otp");
      if (Opt === code) {
        navigate("/password-reset");
      } else {
        createNotification({ type: "error", message: "Please enter correct OTP" });
      }
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    setTimer1(60); // 2 minutes in seconds
  };

  useEffect(() => {
    let interval1: any;

    if (isRunning) {
      interval1 = setInterval(() => {
        setTimer1((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    }

    setTimeout(() => {
      localStorage.removeItem("otp");
      setIsOTP(false);
    }, 60000);
    return () => {
      clearInterval(interval1);
    };
  }, [isRunning]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <>
      <AuthComponent screenName={"Forget Password"} title="">
        <form onSubmit={handleSubmit(onSubmit)} id="clientForm">
          <div className={styles.activeTab}>
            <div className={styles.inputContainer}>
              <Input
                type="number"
                name="employeecode"
                register={register}
                placeholder="Enter your employee code"
                inputClass={styles.inputClass}
                errorMessage={error}
              />
              <div className={styles.btnContainer}>
                <Button
                  title={"Go Back"}
                  className={styles.btn2}
                  handleClick={() => navigate("/login")}
                />
                <Button
                  title={"Enter Employee Code"}
                  type="submit"
                  className={styles.btn}
                  isLoading={loader}
                />
              </div>
            </div>
          </div>
        </form>
      </AuthComponent>
      {isOTP && (
        <Modal
          {...{
            open: isOTP ? true : false,
          }}
          className={styles.modalWrapper}
          showCross={true}
          handleCross={() => {
            setIsOTP(false);
            setCode("");
          }}
        >
          <div>
            <div className={styles.mainHeading}>Enter the OTP</div>
            <div className={styles.optInputField}>
              <OtpInput
                value={code}
                onChange={handleChange}
                numInputs={6}
                isInputNum={true}
                shouldAutoFocus={true}
                inputStyle={{
                  border: "1px solid transparent",
                  borderRadius: "8px",
                  width: "25px",
                  height: "25px",
                  fontSize: "18px",
                  color: "#000",
                  fontWeight: "400",
                  caretColor: "blue",
                }}
                focusStyle={{
                  border: "1px solid #CFD3DB",
                  outline: "none",
                }}
                renderInput={(props) => <input {...props} />}
              />
            </div>
            <div>{otpError}</div>
            <div className={styles.btnClass}>
              <Button
                title={`Enter OTP ${formatTime(timer1)}`}
                handleClick={() => handleOtpSubmit()}
                className={styles.otpBtn}
                isLoading={loader}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default memo(ForgotPassword);
