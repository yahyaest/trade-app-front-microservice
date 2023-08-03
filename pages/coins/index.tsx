/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import { GetServerSideProps } from "next";
import Cookies from "js-cookie";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Page } from "../../types/types";
import AppConfig from "../../layout/AppConfig";
import { getCoin, getCoins } from "@/services";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { CryptoCoin } from "@/models/cryptoCoin";
import { BreadCrumb } from "primereact/breadcrumb";

const CoinsPage: Page = (props: any) => {
  const { error } = props;
  const coins: CryptoCoin[] = props.coins;

  const [coinsList, setCoinsList] = useState<CryptoCoin[]>(coins);
  const [loading, setLoading] = useState<boolean>(true);

  const toast: any = useRef(null);

  const router = useRouter();

  const items = coins ? [{ label: `coins` }] : null;
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
      const updatedCoin = await getCoin(token, id);
      let coins: CryptoCoin[] = [...coinsList];
      let coinIndex = coins.findIndex((coin) => coin.id === id);
      coins[`${coinIndex}`] = updatedCoin;
      setCoinsList(coins);
    } catch (error: any) {
      console.log(error.message);
      errorToast(error.message);
    }
  };

  const coinCard = (coin: CryptoCoin) => {
    return (
      <div
        className="border-1 surface-border border-round m-3 text-center py-5 px-3"
        style={{ width: "400px", maxWidth: "400px" }}
        key={coin.id}
      >
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
        <h6 className="mt-0 mb-3">Price : ${(+coin.price).toFixed(3)}</h6>
        <div className="mt-0 mb-3 text-center flex flex-row flex-wrap align-items-center justify-content-center">
          <h6 className="mr-4 mt-3">
            Last update : {coin.updatedAt.replace("T", " ").split(".")[0]}
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
        <div className="mt-3">
          <Button
            label="Visit"
            severity="info"
            size="small"
            rounded
            outlined
            raised
            onClick={() => router.push(`/coins/${coin.name}`)}
          />
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
      <h1>Coins Page</h1>
      <Toast ref={toast} />
      <BreadCrumb model={items as any} home={home} className="mb-3" />
      <div className="flex flex-row flex-wrap align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        {coinsList
          .sort((a: CryptoCoin, b: CryptoCoin) => a.rank - b.rank)
          .map((coin: CryptoCoin) => coinCard(coin))}
      </div>
    </div>
  );
};

CoinsPage.getLayout = function getLayout(page) {
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
  try {
    const token = context.req.cookies["token"];

    if (!token) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    const coins: CryptoCoin[] = await getCoins(token);

    return {
      props: { coins, error: null },
    };
  } catch (error: any) {
    return {
      props: { error: error.message },
    };
  }
};

export default CoinsPage;
