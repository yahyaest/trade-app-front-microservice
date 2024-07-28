import React from "react";
import { Page } from "../../types/types";
import Image from "next/image";

const ForexPage: Page = () => {
  return (
    <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <div className="flex flex-column align-items-center justify-content-center mx-2 sm:mx-0">
        <img
          src="/demo/images/notfound/logo-blue.svg"
          alt="Sakai logo"
          className="mb-5 w-6rem flex-shrink-0"
        />
        <div
          style={{
            borderRadius: "56px",
            padding: "0.3rem",
            background:
              "linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)",
          }}
        >
          <div
            className="w-full surface-card py-8 px-0 sm:px-8 flex flex-column align-items-center"
            style={{ borderRadius: "53px" }}
          >
            <h1 className="text-900 font-bold text-5xl mb-2">Forex</h1>
            <div className="text-600 mb-5">Feature Comming Soon</div>
            <Image
              src="/images/forex_trading.webp"
              alt="Forex Tading"
              className="dark:invert w-full"
              width={500}
              height={350}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForexPage;
