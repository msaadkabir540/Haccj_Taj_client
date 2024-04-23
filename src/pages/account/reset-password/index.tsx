import { useForm } from "react-hook-form";
import "jsoneditor-react/es/editor.min.css";
import { memo, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Input from "@/components/input";
import Button from "@/components/button";

import createNotification from "@/common/create-notification";

import { ResetPasswordFromInterface } from "@/interface/index";

import styles from "./index.module.scss";

const ResetPassword: React.FC = () => {
  const { id = "", token = "" } = useParams<{
    id: string;
    token: string;
  }>();

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

  const onSubmit = async (data: ResetPasswordFromInterface) => {
    // setLoader(true);
    // const res = await resetPassword({
    //   id,
    //   data: {
    //     password: data.password,
    //   },
    //   token,
    // });
    // setLoader(false);
    // if (res.status === 200) navigate("/sign-in");
    // else createNotification("error", res?.data?.message || "Failed To Login.", 5000);
  };

  const passwordsMatch = useMemo(() => {
    const password = watch("password");
    const password2 = watch("password2");
    return password === password2;
  }, [watch("password"), watch("password2")]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} id="clientForm">
        <div className={styles.activeTab} style={{ marginBottom: "15px" }}>
          <h2>Reset Password</h2>
          <div className={styles.inputContainer}>
            <Input
              name="password"
              type={"password"}
              register={register}
              placeholder="Enter Password"
              errorMessage={errors?.password?.message}
            />
            <Input
              name="password2"
              type={"password"}
              register={register}
              placeholder="Confirm Password"
              errorMessage={errors?.password?.message}
            />
            <div className={styles.btnContainer}>
              <Button
                title={"Submit"}
                type="submit"
                isLoading={loader}
                className={styles.btn}
                disabled={!passwordsMatch}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default memo(ResetPassword);
