/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/router";
import React, { useContext, useRef, useState } from "react";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";
import { Page } from "../../../types/types";
import AppConfig from "../../../layout/AppConfig";
import { LayoutContext } from "../../../layout/context/layoutcontext";
import GatewayClient from "@/services/gateway";
import { User } from "@/models/user";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";

const LoginPage: Page = () => {
  const gatewayClient = new GatewayClient();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [file, setFile] = useState("");

  const { layoutConfig } = useContext(LayoutContext);

  const toast: any = useRef(null);
  const router = useRouter();

  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig?.inputStyle === "filled" }
  );

  const registerToast = (state: boolean): Promise<void> => {
    return new Promise((resolve) => {
      toast.current?.show({
        severity: state ? "success" : "error",
        summary: state ? "Register Success" : "Register Failed",
        detail: state ? "You have successfully Registered" : "Wrong Credential",
        life: 3000,
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

  const genericToast = (severity: string, summary: string, message: string) => {
    toast.current?.show({
      severity: severity,
      summary: summary,
      detail: message,
      life: 3000,
    });
  };

  const submit = async () => {
    try {
      if (password !== password2) {
        genericToast("error", "Password", "Passwords does not match");
        return;
      }
      const { isRegister, message } = await gatewayClient.register(
        username,
        email,
        password
      );
      if (!isRegister) {
        genericToast("error", "Register Failed", message);
      } else {
        const user = (await gatewayClient.getCurrentUser()) as User;
        // upload image
        if (file) {
          await gatewayClient.uploadImage(file, user?.email as string);
          const userImage = await gatewayClient.getCurrentUserAvatar();
          if (userImage) user.avatarUrl = userImage;
        }
        Cookies.set("user", JSON.stringify(user));
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
                Username
              </label>
              <InputText
                id="username1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Username"
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
              />

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
                type="email"
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

              <label
                htmlFor="password2"
                className="block text-900 font-medium text-xl mb-2"
              >
                Confirm Password
              </label>
              <Password
                inputId="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Confirm Password"
                toggleMask
                className="w-full mb-5"
                inputClassName="w-full p-3 md:w-30rem"
              ></Password>

              <label
                htmlFor="avatar"
                className="block text-900 font-medium text-xl mb-2"
              >
                Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile((e.target.files as any)[0])}
              />

              <div className="flex align-items-center justify-content-between mb-5 gap-5"></div>
              <Button
                label="Register"
                className="w-full p-3 text-xl"
                onClick={() => submit()}
                disabled={!username || !email || !password || !password2}
              ></Button>
              <span className="">
                <p className="font-medium no-underline my-3">
                  You have an account ?
                </p>
              </span>
              <Button
                label="Login"
                className="w-full p-3 text-xl"
                onClick={() => router.push("/auth/login")}
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
