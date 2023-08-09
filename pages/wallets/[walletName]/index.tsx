/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import { GetServerSideProps } from "next";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { DataView } from "primereact/dataview";
import {
  getAssets,
  getAssetsByQuery,
  getTransactions,
  getWalletByName,
} from "@/services";
import { Wallet } from "@/models/wallet";
import { Tag } from "primereact/tag";
import AddWalletModal from "@/components/addWalletModal";
import { Page } from "../../../types/types";
import AppConfig from "../../../layout/AppConfig";
import "primeflex/primeflex.css";
import { formatCurrency } from "@/utils/utils";
import { BreadCrumb } from "primereact/breadcrumb";
import { Transaction } from "@/models/transaction";
import { Asset } from "@/models/asset";

const WalletPage: Page = (props: any) => {
  const { error } = props;
  const wallet: Wallet = props.wallet;
  const walletTransactions: Transaction[] = props.walletTransactions;
  const walletAssets: Asset[] = props.walletAssets;
  const { lastWeekTransactionsNumber, lastWeekAssetsNumber } = props;

  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const toast: any = useRef(null);

  const items = wallet
    ? [{ label: `wallets`, url: `/wallets` }, { label: `${wallet.name}` }]
    : null;
  const home = { icon: "pi pi-home", label: "icons", url: "/" };

  const cardsInfo = [
    {
      label: "Coins",
      number: walletAssets.length,
      lastWeek: lastWeekAssetsNumber,
    },
    {
      label: "Assets",
      number: walletAssets.length,
      lastWeek: lastWeekAssetsNumber,
    },
    ,
    {
      label: "Transactions",
      number: walletTransactions.length,
      lastWeek: lastWeekTransactionsNumber,
    },
  ];

  const infoCard = (card: any) => {
    return (
      <div
        key={card.label}
        className="border-1 surface-border border-round m-5 text-center flex flex-column justify-content-center align-items-center"
        style={{
          width: "400px",
          maxWidth: "500px",
          minWidth: "300px",
          height: "250px",
          cursor: "pointer",
          borderRadius: "25px !important",
          border: "1px solid silver !important",
          background: "whitesmoke",
        }}
      >
        <h3>{card.label}</h3>
        <h4>{card.number}</h4>
        <p>{card.lastWeek} since last week</p>
      </div>
    );
  };

  const errorToast = (error: any) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  };

  useEffect(() => {
    if (wallet) setLoading(false);
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
    <React.Fragment>
      <div className="surface-ground align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden text-center">
        <h1>Wallet Page</h1>
        <Toast ref={toast} />
        <BreadCrumb model={items as any} home={home} className="mb-3" />
        <div className="flex align-items-center justify-content-center text-center">
          {cardsInfo.map((card) => infoCard(card))}
        </div>
      </div>
    </React.Fragment>
  );
};

WalletPage.getLayout = function getLayout(page) {
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

    const walletName = context.params.walletName;
    const wallet: Wallet = await getWalletByName(token, walletName);

    const transactionQuery = { wallet: walletName };
    const walletTransactions: Transaction[] = await getTransactions(
      token,
      transactionQuery
    );

    const assetQuery = { name: walletName };
    const walletAssets: Asset[] | undefined = await getAssets(
      token,
      assetQuery
    );

    const lastWeekTransactionQuery = { wallet: walletName, days: "7" };
    const lastWeekWalletTransactions: Transaction[] = await getTransactions(
      token,
      lastWeekTransactionQuery
    );

    const lastWeekAssetQuery = { walletName, days: "7" };
    const lastWeekWalletAssets: Asset[] = await getAssetsByQuery(
      token,
      lastWeekAssetQuery
    );

    return {
      props: {
        wallet,
        walletTransactions,
        walletAssets,
        lastWeekTransactionsNumber: lastWeekWalletTransactions.length,
        lastWeekAssetsNumber: lastWeekWalletAssets.length,
        error: null,
      },
    };
  } catch (error: any) {
    return {
      props: { error: error.message },
    };
  }
};

export default WalletPage;
