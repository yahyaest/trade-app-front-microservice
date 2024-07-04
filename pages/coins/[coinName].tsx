/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import Cookies from "js-cookie";
import { BreadCrumb } from "primereact/breadcrumb";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Page } from "../../types/types";
import AppConfig from "../../layout/AppConfig";
import {
  getCoin,
  getCoinByName,
  getCoinChartData,
  getUserWallets,
} from "@/services";
import styles from "./coinDetails.module.css";
import CoinChart from "@/components/coinChart";
import CoinInfos from "@/components/coinInfos";
import CoinHeader from "@/components/coinHeader";
import { CryptoCoin } from "@/models/cryptoCoin";
import { Wallet } from "@/models/wallet";

const CoinDetailPage: Page = (props: any) => {
  const { coinChartData, initialVerticalData, initialHorizentalData, error } =
    props;
  const coin: CryptoCoin = props.coin;

  const [currentCoin, setCurrentCoin] = useState<CryptoCoin>(coin);
  const [userWallets, setUserWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModal, setIsModal] = useState<boolean>(false);

  const toast: any = useRef(null);

  const errorToast = () => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  };

  const HandleBuyButton = async () => {
    try {
      const token = Cookies.get("token") as string;
      let wallets: Wallet[] = await getUserWallets(token);
      wallets = wallets.filter((wallet) => wallet.type === "CRYPTO");
      setUserWallets(wallets);
      setIsModal(true);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const items = coin
    ? [{ label: `coins`, url: "/coins" }, { label: `${coin.name}` }]
    : null;
  const home = { icon: "pi pi-home", label: "icons", url: "/" };

  useEffect(() => {
    if (currentCoin) setLoading(false);
  }, []);

  if (error) {
    console.log(error);
    errorToast();
    return (
      <div className="flex justify-content-center align-items-center min-h-screen min-w-screen overflow-hidden">
        <Toast ref={toast} />
        <h3>{error}</h3>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen min-w-screen overflow-hidden">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="surface-ground align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden text-center">
      <Toast ref={toast} />
      <BreadCrumb model={items as any} home={home} className="mb-3" />

      <CoinHeader
        coin={coin}
        currentCoin={currentCoin}
        userWallets={userWallets}
        isModal={isModal}
        setIsModal={setIsModal}
        HandleBuyButton={HandleBuyButton}
        toast={toast}
      />

      <CoinChart
        coin={coin}
        coinChartData={coinChartData}
        initialVerticalData={initialVerticalData}
        initialHorizentalData={initialHorizentalData}
        styles={styles}
      />
      <CoinInfos coin={coin} />
    </div>
  );
};

// CoinDetailPage.getLayout = function getLayout(page) {
//   return (
//     <React.Fragment>
//       {page}
//       <AppConfig simple />
//     </React.Fragment>
//   );
// };

//// Server Side  ////

export const getServerSideProps: GetServerSideProps<{}> = async (
  context: any
) => {
  try {
    const token = context.req.cookies["token"];
    const { coinName } = context.params;

    if (!token) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    let coin: CryptoCoin = await getCoinByName(token, coinName);
    coin = await getCoin(token, coin.id);

    const coinChartData = await getCoinChartData(token, coin.id, "1h");

    let initialVerticalData = [];
    let initialHorizentalData = [];

    for (let element of coinChartData.chart) {
      initialVerticalData.push(element.chartPrice);
      initialHorizentalData.push(element.time);
    }
    return {
      props: {
        coin,
        coinChartData,
        initialVerticalData,
        initialHorizentalData,
        error: null,
      },
    };
  } catch (error: any) {
    console.log("error type  : ", error.message);
    return { props: { error: error.message } };
  }
};

export default CoinDetailPage;
