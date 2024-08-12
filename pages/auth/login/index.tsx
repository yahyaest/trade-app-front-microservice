/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/router";
import React, { useContext, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import Cookies from "js-cookie";
import { Page } from "../../../types/types";
import AppConfig from "../../../layout/AppConfig";
import { LayoutContext } from "../../../layout/context/layoutcontext";
import GatewayClient from "@/services/gateway";
import { User } from "@/models/user";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";

const LoginPage: Page = () => {
  const gatewayClient = new GatewayClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const { layoutConfig } = useContext(LayoutContext);

  const toast: any = useRef(null);
  const router = useRouter();

  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig?.inputStyle === "filled" }
  );

  const loginToast = (state: boolean): Promise<void> => {
    return new Promise((resolve) => {
      toast.current?.show({
        severity: state ? "success" : "error",
        summary: state ? "Login Success" : "Login Failed",
        detail: state ? "You have successfully logged in" : "Wrong Credential",
        life: state ? 1500 : 3000,
      });
      // Resolve the promise after the duration of the toast
      setTimeout(
        () => {
          resolve();
        },
        state ? 1500 : 3000
      );
    });
  };

  const notImplementedToast = () => {
    toast.current?.show({
      severity: "info",
      summary: "Info",
      detail: "This feature is not implemented yet",
      life: 3000,
    });
  };

  const submit = async () => {
    try {
      const isLogin = await gatewayClient.login(email, password);
      if (!isLogin) {
        await loginToast(false);
      } else {
        const user = (await gatewayClient.getCurrentUser()) as User;
        const userImage = await gatewayClient.getCurrentUserAvatar();
        if (userImage) user.avatarUrl = userImage;
        Cookies.set("user", JSON.stringify(user));
        await loginToast(true);
        router.push("/");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className={containerClassName}>
      <Toast ref={toast} />
      <div className="flex flex-column align-items-center justify-content-center">
        <img
          src={`/layout/images/logo-${
            layoutConfig?.colorScheme === "light" ? "dark" : "white"
          }.svg`}
          alt="Sakai logo"
          className="mb-5 mt-3 w-6rem flex-shrink-0"
        />
        <div
          style={{
            borderRadius: "56px",
            padding: "0.3rem",
            background:
              "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
          }}
        >
          <div
            className="w-full surface-card py-8 px-5 sm:px-8"
            style={{ borderRadius: "53px" }}
          >
            <div>
              <label
                htmlFor="email1"
                className="block text-900 text-xl font-medium mb-2"
              >
                Email
              </label>
              <InputText
                id="email1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Email address"
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
              />

              <label
                htmlFor="password1"
                className="block text-900 font-medium text-xl mb-2"
              >
                Password
              </label>
              <Password
                inputId="password1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                toggleMask
                className="w-full mb-5"
                inputClassName="w-full p-3 md:w-30rem"
              ></Password>

              <div className="flex align-items-center justify-content-between mb-5 gap-5">
                <div className="flex align-items-center">
                  <Checkbox
                    inputId="rememberme1"
                    checked={checked}
                    onChange={(e) => setChecked(e.checked ?? false)}
                    className="mr-2"
                  ></Checkbox>
                  <label htmlFor="rememberme1">Remember me</label>
                </div>
                <a
                  className="font-medium no-underline ml-2 text-right cursor-pointer"
                  style={{ color: "var(--primary-color)" }}
                  onClick={() => notImplementedToast()}
                >
                  Forgot password?
                </a>
              </div>
              <Button
                label="Login"
                className="w-full p-3 text-xl"
                onClick={() => submit()}
                disabled={!email || !password}
              ></Button>
              <span>
                <p className="font-medium no-underline my-3">
                  Don&apos;t have an account ?
                </p>
              </span>
              <Button
                label="Register"
                className="w-full p-3 text-xl"
                onClick={() => router.push("/auth/register")}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginPage.getLayout = function getLayout(page) {
  return (
    <React.Fragment>
      {page}
      <AppConfig simple />
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (
  context: any
) => {
  const token = context.req.cookies["token"];

  if (token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
export default LoginPage;
