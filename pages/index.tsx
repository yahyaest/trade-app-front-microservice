/* eslint-disable @next/next/no-img-element */
import React, { useContext, useRef, useState } from "react";
import Link from "next/link";

import { StyleClass } from "primereact/styleclass";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { Divider } from "primereact/divider";
import AppConfig from "../layout/AppConfig";
import { LayoutContext } from "../layout/context/layoutcontext";
import { NodeRef, Page } from "../types/types";
import { classNames } from "primereact/utils";
import { useRouter } from "next/router";

const Home: Page = () => {
  const [isHidden, setIsHidden] = useState(false);
  const { layoutConfig } = useContext(LayoutContext);
  const menuRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const toggleMenuItemClick = () => {
    setIsHidden((prevState) => !prevState);
  };

  return (
    <div className="surface-0 flex justify-content-center">
      <div id="home" className="landing-wrapper overflow-hidden">
        {/* <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static">
          <Link href="/" className="flex align-items-center">
            <img
              src={`/layout/images/${
                layoutConfig.colorScheme === "light"
                  ? "logo-dark"
                  : "logo-white"
              }.svg`}
              alt="Sakai Logo"
              height="50"
              className="mr-0 lg:mr-2"
            />
            <span className="text-900 font-medium text-2xl line-height-3 mr-8">
              SAKAI
            </span>
          </Link>
          <StyleClass
            nodeRef={menuRef as NodeRef}
            selector="@next"
            enterClassName="hidden"
            leaveToClassName="hidden"
            hideOnOutsideClick
          >
            <i
              ref={menuRef}
              className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"
            ></i>
          </StyleClass>
          <div
            className={classNames(
              "align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2",
              { hidden: isHidden }
            )}
            style={{ top: "100%" }}
          >
            <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
              <li>
                <a
                  href="#home"
                  onClick={toggleMenuItemClick}
                  className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"
                >
                  <span>Home</span>
                  <Ripple />
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={toggleMenuItemClick}
                  className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"
                >
                  <span>Features</span>
                  <Ripple />
                </a>
              </li>
              <li>
                <a
                  href="#highlights"
                  onClick={toggleMenuItemClick}
                  className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"
                >
                  <span>Highlights</span>
                  <Ripple />
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={toggleMenuItemClick}
                  className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"
                >
                  <span>Pricing</span>
                  <Ripple />
                </a>
              </li>
            </ul>
            <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
              <Button
                label="Login"
                text
                rounded
                className="border-none font-light line-height-2 text-blue-500"
              ></Button>
              <Button
                label="Register"
                rounded
                className="border-none ml-5 font-light line-height-2 bg-blue-500 text-white"
              ></Button>
            </div>
          </div>
        </div> */}

        <div
          id="hero"
          className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EEEFAF 0%, #C3E3FA 100%)",
            clipPath: "ellipse(150% 87% at 93% 13%)",
          }}
        >
          <div className="mx-4 md:mx-8 mt-0 md:mt-4">
            <h1 className="text-6xl font-bold text-yellow-400 line-height-2">
              <span className="font-light block"></span>All In One Trade
              Simulator
            </h1>
            <div className="font-normal text-2xl line-height-3 md:mt-3 text-gray-700 lg:w-7">
              <div className="my-5">Welcome to the Future of Trading!</div>
              Introducing our All In One Trade Simulator app – your gateway to
              exploring the world of crypto, stocks, and forex. With a virtual
              wallet at your fingertips, you can practice trading in a risk-free
              environment, hone your skills, and build the confidence to thrive
              in the real markets. Trade smarter, learn faster, and embark on
              your journey to financial success with us today.
              <div className="my-5">
                Start your simulated trading adventure now!
              </div>
            </div>
            <Button
              type="button"
              label="Get Started"
              rounded
              className="text-xl border-none mt-3 bg-blue-500 font-normal line-height-3 px-3 text-white"
              onClick={() => {
                router.push("/wallets");
              }}
            ></Button>
          </div>
          <div className="flex justify-content-center md:justify-content-end">
            <img
              src="/demo/images/landing/banner.png"
              alt="Hero Image"
              className="w-9 md:w-auto"
            />
          </div>
        </div>

        <div id="features" className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
          <div className="grid justify-content-center">
            <div className="col-12 text-center mt-8 mb-4">
              <h2 className="text-900 text-green-600 font-bold mb-2">
                Why choose our solution
              </h2>
            </div>

            <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0 text-center">
              <div
                style={{
                  height: "275px",
                  padding: "2px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))",
                }}
              >
                <div
                  className="p-3 surface-card h-full"
                  style={{ borderRadius: "8px" }}
                >
                  <div
                    className="bg-yellow-200 mb-3"
                    style={{
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      src="/demo/images/landing/start_instantly.png"
                      alt="start_instantly.png"
                    />
                  </div>
                  <h5 className="mb-2 text-900 font-bold text-red-500">
                    Start Instantly
                  </h5>
                  <span className="text-700 text-lg">
                    Begin your trading journey without delay. Our intuitive
                    platform allows you to start trading in seconds, eliminating
                    the need for complex setup processes.
                  </span>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0 text-center">
              <div
                style={{
                  height: "275px",
                  padding: "2px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(145,226,237,0.2),rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))",
                }}
              >
                <div
                  className="p-3 surface-card h-full"
                  style={{ borderRadius: "8px" }}
                >
                  <div
                    className="flex align-items-center justify-content-center bg-cyan-200 mb-3"
                    style={{
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      src="demo/images/landing/easy_to_use.png"
                      alt="easy_to_use.png"
                    />
                  </div>
                  <h5 className="mb-2 text-900 font-bold text-red-500">
                    Easy To Use
                  </h5>
                  <span className="text-700 text-lg">
                    Experience trading made simple. Our user-friendly interface
                    ensures that traders of all levels, from beginners to
                    experts, can navigate our platform effortlessly.
                  </span>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0 text-center">
              <div
                style={{
                  height: "275px",
                  padding: "2px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))",
                }}
              >
                <div
                  className="p-3 surface-card h-full"
                  style={{ borderRadius: "8px" }}
                >
                  <div
                    className="flex align-items-center justify-content-center bg-indigo-200"
                    style={{
                      borderRadius: "10px",
                    }}
                  >
                    <img
                      src="/demo/images/landing/secure_and _regulated.png"
                      alt="secure_and _regulated.png"
                    />
                  </div>
                  <h5 className="mb-2 text-900 font-bold text-red-500">
                    Secure and Regulated
                  </h5>
                  <span className="text-700 text-lg">
                    Your security is our priority. We implement robust security
                    measures to safeguard your data and investments, giving you
                    peace of mind while you trade.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="highlights" className="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
          <div className="text-center">
            <h2 className="text-900 text-green-600 font-bold mb-2">
              Powerful Everywhere
            </h2>
          </div>

          <div className="grid mt-8 pb-2 md:pb-8">
            <div
              className="flex justify-content-center col-12 lg:col-6 bg-purple-100 p-0 flex-order-1 lg:flex-order-0"
              style={{ borderRadius: "8px" }}
            >
              <img
                src="/demo/images/landing/chart.webp"
                className="w-11"
                alt="mockup mobile"
              />
            </div>

            <div className="col-12 lg:col-6 my-auto flex flex-column lg:align-items-end text-center lg:text-left">
              <div
                className="flex align-items-center justify-content-center bg-purple-200 align-self-center lg:align-self-end"
                style={{
                  width: "4.2rem",
                  height: "4.2rem",
                  borderRadius: "10px",
                }}
              >
                <i className="pi pi-fw pi-chart-line text-5xl text-purple-700"></i>
              </div>
              <h2 className="line-height-1 text-900 text-4xl font-bold text-red-500">
                Real Time Data
              </h2>
              <span
                className="text-700 text-2xl line-height-3 ml-0 md:ml-2"
                style={{ maxWidth: "650px" }}
              >
                Stay ahead of the game with real-time market data at your
                fingertips. Our platform provides you with up-to-the-second
                information, empowering you to make informed trading decisions.
                <br />
                No more guessing or relying on outdated information. Access
                accurate, real-time data to track market movements and seize
                opportunities as they happen.
              </span>
            </div>
          </div>

          <div className="grid my-8 pt-2 md:pt-8">
            <div className="col-12 lg:col-6 my-auto flex flex-column text-center lg:text-left lg:align-items-start">
              <div
                className="flex align-items-center justify-content-center bg-yellow-200 align-self-center lg:align-self-start"
                style={{
                  width: "4.2rem",
                  height: "4.2rem",
                  borderRadius: "10px",
                }}
              >
                <i className="pi pi-fw pi-wallet text-5xl text-yellow-700"></i>
              </div>
              <h2 className="line-height-1 text-900 text-4xl font-bold text-red-500">
                Manage Your Portfolio
              </h2>
              <span
                className="text-700 text-2xl line-height-3 mr-0 md:mr-2"
                style={{ maxWidth: "650px" }}
              >
                Take control of your investments effortlessly. Our portfolio
                management tools allow you to track, analyze, and optimize your
                holdings with ease.
                <br />
                Organize and monitor your assets efficiently. Whether you have a
                diverse portfolio or a focused selection, we provide the tools
                you need to stay in control.
              </span>
            </div>

            <div
              className="flex justify-content-end flex-order-1 sm:flex-order-2 col-12 lg:col-6 bg-yellow-100 p-0"
              style={{ borderRadius: "8px" }}
            >
              <img
                src="/demo/images/landing/portfolio.png"
                className="w-11"
                alt="mockup"
              />
            </div>
          </div>

          <div className="grid mt-8 pb-2 md:pb-8">
            <div
              className="flex justify-content-center col-12 lg:col-6 bg-blue-100 p-0 flex-order-1 lg:flex-order-0"
              style={{ borderRadius: "8px" }}
            >
              <img
                src="/demo/images/landing/app.png"
                className="w-11"
                alt="mockup mobile"
              />
            </div>

            <div className="col-12 lg:col-6 my-auto flex flex-column lg:align-items-end text-center lg:text-left">
              <div
                className="flex align-items-center justify-content-center bg-blue-200 align-self-center lg:align-self-end"
                style={{
                  width: "4.2rem",
                  height: "4.2rem",
                  borderRadius: "10px",
                }}
              >
                <i className="pi pi-fw pi-mobile text-5xl text-blue-700"></i>
              </div>
              <h2 className="line-height-1 text-900 text-4xl font-bold text-red-500">
                Trade On The Mobile App
              </h2>
              <span
                className="text-700 text-2xl line-height-3 ml-0 md:ml-2"
                style={{ maxWidth: "650px" }}
              >
                Trade anytime, anywhere with our mobile app. Carry the power of
                trading in your pocket and never miss an opportunity, even when
                you&apos;re on the go.
                <br />
                Seamlessly transition between devices. Our mobile app offers the
                same robust features and security as the desktop version,
                ensuring a consistent and convenient trading experience.
              </span>
              <div className=" flex flex-wrap justify-content-center gap-3 pt-5">
                <Button type="button" label="Play Store" icon="pi pi-android" />
                <Button type="button" label="App Store" icon="pi pi-apple" />
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 px-4 mx-0 mt-8 lg:mx-8">
          <div className="grid justify-content-between">
            <div className="col-12 md:col-2" style={{ marginTop: "-1.5rem" }}>
              <Link
                href="/"
                className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer"
              >
                <img
                  src={`/layout/images/${
                    layoutConfig.colorScheme === "light"
                      ? "logo-dark"
                      : "logo-white"
                  }.svg`}
                  alt="footer sections"
                  width="50"
                  height="50"
                  className="mr-2"
                />
                <span className="font-medium text-3xl text-900">SAKAI</span>
              </Link>
            </div>

            <div className="col-12 md:col-10 lg:col-7">
              <div className="grid text-center md:text-left">
                <div className="col-12 md:col-3">
                  <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">
                    Company
                  </h4>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    About Us
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    News
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Investor Relations
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Careers
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer text-700">
                    Media Kit
                  </a>
                </div>

                <div className="col-12 md:col-3 mt-4 md:mt-0">
                  <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">
                    Resources
                  </h4>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Get Started
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Learn
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer text-700">
                    Case Studies
                  </a>
                </div>

                <div className="col-12 md:col-3 mt-4 md:mt-0">
                  <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">
                    Community
                  </h4>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Discord
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Events
                    <img
                      src="/demo/images/landing/new-badge.svg"
                      className="ml-2"
                      alt="badge"
                    />
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    FAQ
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer text-700">
                    Blog
                  </a>
                </div>

                <div className="col-12 md:col-3 mt-4 md:mt-0">
                  <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">
                    Legal
                  </h4>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Brand Policy
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Privacy Policy
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer text-700">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Home.getLayout = function getLayout(page) {
//   return (
//     <React.Fragment>
//       {page}
//       <AppConfig simple />
//     </React.Fragment>
//   );
// };

export default Home;
