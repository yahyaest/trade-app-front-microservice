/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Page } from "../../types/types";
import Cookies from "js-cookie";
import AppConfig from "../../layout/AppConfig";
import { CustomLogger } from "@/utils/logger";
import CryptoClient from "@/services/crypto";
import { CryptoCoin } from "@/models/cryptoCoin";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";
import styles from "./coins.module.css";

const CoinsPage: Page = (props: any) => {
  const { error } = props;
  const coins: CryptoCoin[] = props.coins;

  const [coinsList, setCoinsList] = useState<CryptoCoin[]>(coins);
  const [loading, setLoading] = useState<boolean>(true);

  const toast: any = useRef(null);

  const router = useRouter();

  const items = coins
    ? [{ label: `wallets`, url: "/wallets" }, { label: `coins` }]
    : null;
  const home = { icon: "pi pi-home", label: "icons", url: "/" };

  const errorToast = (error: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  };

  const updateCoinToast = (coinName: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Coin update",
      detail: `Coin ${coinName} updated successfully`,
      life: 3000,
    });
  };

  const updateCoin = async (id: number) => {
    try {
      const token = Cookies.get("token") as string;
      const cryptoClient = new CryptoClient();
      const updatedCoin = await cryptoClient.getCoin(token, id);

      let coins: CryptoCoin[] = [...coinsList];
      let coinIndex = coins.findIndex((coin) => coin.id === id);
      coins[`${coinIndex}`] = updatedCoin;
      setCoinsList(coins);
    } catch (error: any) {
      console.log(error.message);
      errorToast(error.message);
    }
  };

  const cardStyle = (coin: CryptoCoin) => {
    return {
      container: {
        position: "relative",
      },
      card: {
        position: "relative",
        width: "400px",
        "max-width": "500px",
        "min-width": "300px",
        height: "250px",
        cursor: "pointer",
        "border-radius": "25px !important",
        transition: "all 0.5s",
        overflow: "hidden",
      },
      before: {
        position: "absolute",
        top: "0",
        left: "0",
        background: `url(${coin.iconUrl})`,
        "background-size": "cover",
        filter: "blur(5px)",
        // transform: "scale(3)",
        content: '""',
      },
    };
  };

  const coinCard = (coin: CryptoCoin) => {
    return (
      <div
        className={`${styles.card} border-1 surface-border border-round m-5 text-center flex flex-column justify-content-center align-items-center`}
        style={{
          position: "relative",
          overflow: "hidden", // Hide any overflow from the overlay
        }}
        key={coin.id}
        onClick={() => router.push(`/coins/${coin.name}`)}
      >
        {/* Overlay with blur effect */}
        <div
          className={styles.cardOverlay}
          style={{ backgroundImage: `url(${coin.iconUrl})`, opacity: 0.8 }} // Set initial opacity to less than 1
        ></div>

        {/* Main card content */}
        <div className="">
          <div className="mb-3 flex flex-row flex-wrap align-items-center justify-content-center">
            <h5 className="mb-1">
              {coin.name} ({coin.symbol})
            </h5>
            <img
              className="ml-5"
              src={`${coin.iconUrl}`}
              alt={coin.name}
              width={32}
              style={{ verticalAlign: "middle" }}
            />
          </div>
          <h6 className="mt-0 mb-3">
            <strong>Price</strong> : ${(+coin.price).toFixed(3)}
          </h6>
          <div className="mt-0 mb-3 text-center flex flex-row flex-wrap align-items-center justify-content-center">
            <h6 className="mr-4 mt-3 flex align-items-center justify-content-center">
              <strong>Last update </strong>
              <p> : {coin.updatedAt.replace("T", " ").split(".")[0]}</p>
            </h6>
            <Button
              style={{ width: "30px", height: "30px" }}
              icon="pi pi-sync"
              severity="info"
              rounded
              onClick={() => {
                updateCoin(coin.id);
                updateCoinToast(coin.name);
              }}
            />
          </div>
          <Tag value={`Rank #${coin.rank}`} severity="success"></Tag>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (coinsList) setLoading(false);
  }, []);

  if (error) {
    console.log(error);
    errorToast(error);
    return (
      <div className="flex justify-content-center align-items-center min-h-screen min-w-screen overflow-hidden">
        <Toast ref={toast} />
        <h3>{error}</h3>
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex justify-content-center align-items-center min-h-screen min-w-screen overflow-hidden">
        <ProgressSpinner />
      </div>
    );

  return (
    <div className="surface-ground align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden text-center">
      <BreadCrumb model={items as any} home={home} className="my-3" />
      <h1 className="font-bold text-3xl sm:text-6xl text-yellow-500">
        Top 100 Crypto Coins
      </h1>
      <Toast ref={toast} />
      <div className="flex flex-row flex-wrap align-items-center justify-content-center mx-3">
        {coinsList
          .sort((a: CryptoCoin, b: CryptoCoin) => a.rank - b.rank)
          .map((coin: CryptoCoin) => coinCard(coin))}
      </div>
    </div>
  );
};

// CoinsPage.getLayout = function getLayout(page) {
//   return (
//     <React.Fragment>
//       {page}
//       <AppConfig simple />
//     </React.Fragment>
//   );
// };

export const getServerSideProps: GetServerSideProps<{}> = async (
  context: any
) => {
  const logger = new CustomLogger();
  try {
    const token = context.req.cookies["token"];

    if (!token) {
      logger.warn("No token was provided. Redirecting to login page");
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    const cryptoClient = new CryptoClient();
    logger.info("Fetching coins data ...");
    const coins: CryptoCoin[] = await cryptoClient.getCoins(token);
    logger.info(`Successfully fetched ${coins.length} coins`);

    return {
      props: { coins, error: null },
    };
  } catch (error: any) {
    logger.error(`Error fetching coins data: ${error.message}`);
    return {
      props: { error: error.message },
    };
  }
};

export default CoinsPage;
