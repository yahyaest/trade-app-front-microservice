/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import { GetServerSideProps } from "next";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import {
  getAssets,
  getAssetsByQuery,
  getCoin,
  getCoinByName,
  getTransactions,
  getWalletByName,
} from "@/services";
import { Wallet } from "@/models/wallet";
import { Page } from "../../../types/types";
import AppConfig from "../../../layout/AppConfig";
import "primeflex/primeflex.css";
import { BreadCrumb } from "primereact/breadcrumb";
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Transaction } from "@/models/transaction";
import { Asset } from "@/models/asset";
import AssetDataTable from "@/components/assetDataTable";
import TransactionDataTable from "@/components/transactionDataTable";
import PieChart from "@/components/pieChart";
import { CryptoCoin } from "@/models/cryptoCoin";
import { formatCurrency } from "@/utils/utils";
import styles from "./walletDashboard.module.css";


const WalletPage: Page = (props: any) => {
  const { symbols, walletCoinList, nonSoldAssetsValue, error } = props;
  const wallet: Wallet = props.wallet;
  const walletTransactions: Transaction[] = props.walletTransactions;
  const walletAssets: Asset[] = props.walletAssets;
  const { lastWeekTransactionsNumber, lastWeekAssetsNumber } = props;
  const [bestAssets, setBestAssets] = useState<Asset[]>([]);
  const [leastAssets, setLeastAssets] = useState<Asset[]>([]);
  const margin = ((+wallet.currentValue + nonSoldAssetsValue - +wallet.intialValue) / +wallet.intialValue * 100).toFixed(2)
  const marginUSD = +wallet.intialValue / 100 * Math.abs(margin)

  const setBestAndLeastAssetsGain = () => {
    const soldAssets = walletAssets.filter(
      (asset) => asset.boughtAmount === asset.soldAmount
    );

    for (let asset of soldAssets) {
      const gain = (
        ((+asset.soldAt - +asset.boughtAt) / +asset.boughtAt) *
        100
      ).toFixed(2);
      asset.gain = gain;
    }

    const gainAssets = soldAssets
      .sort((a: Asset, b: Asset) => +b.gain - +a.gain)
      .slice(0, 5)
      .filter((asset) => +asset.gain > 0);

    const lostAssets = soldAssets
      .sort((a: Asset, b: Asset) => +a.gain - +b.gain)
      .slice(0, 5)
      .filter((asset) => +asset.gain <= 0);

    setBestAssets(gainAssets);
    setLeastAssets(lostAssets);
  };

  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const toast: any = useRef(null);

  const items = wallet
    ? [{ label: `wallets`, url: `/wallets` }, { label: `${wallet.name}` }]
    : null;
  const home = { icon: "pi pi-home", label: "icons", url: "/" };

  const walletCardInfo = {
    label : "Wallet Balance",
    currentValue :formatCurrency(wallet.currentValue) ,
    intialValue : formatCurrency(wallet.intialValue),
    nonSoldAssetsValue : formatCurrency(nonSoldAssetsValue),
    allAssetsValue : formatCurrency(+wallet.currentValue + nonSoldAssetsValue),
    margin: margin
  }

  const cardsInfo = [
    // {
    //   label: "Coins",
    //   number: walletAssets.length,
    //   data: walletAssets,
    //   lastWeek: lastWeekAssetsNumber,
    // },
    {
      label: "Assets",
      number: walletAssets.length,
      data: walletAssets,
      lastWeek: lastWeekAssetsNumber,
    },
    {
      label: "Transactions",
      number: walletTransactions.length,
      data: walletTransactions,
      lastWeek: lastWeekTransactionsNumber,
    },
  ];

  const infoCard = (card: any) => {
    return (
      <div
        key={card.label}
        className={`${styles.infoCard} m-5 text-center flex flex-column justify-content-center align-items-center`}
      >
        <h3>{card.label}</h3>
        <h4>{card.number}</h4>
        <div className="flex justify-content-center mb-3">
            <AvatarGroup>
              {card.data.sort(
                    (a: Transaction, b: Transaction) =>
                      ((new Date(b.createdAt) as any) -
                        new Date(a.createdAt)) as any
                  ).slice(0,4).map((e : Asset | Transaction) => {if("walletId" in e){ return <Avatar key={e.id} image={`${e.transactions[0].coinImage}`} size="large" shape="circle" />} else return <Avatar key={e.id} image={`${e.coinImage}`} size="large" shape="circle" /> })}
              <Avatar label={`+${card.data.length - 4}`} shape="circle" size="large" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }} />
            </AvatarGroup>
            </div>

        <p>{card.lastWeek} since last week</p>
      </div>
    );
  };

  const walletCard = (card: any) => {
    return (
      <div
        key={card.label}
        className={` ${styles.walletCard} m-5 text-center flex flex-column justify-content-center align-items-center`}
      >
        <h3>{card.label}</h3>
        <h6>Intial Wallet Value : {card.intialValue}</h6>
        <h6>Current Wallet Value : {card.currentValue}</h6>
        <h6>Non Sold Assets Value : {card.nonSoldAssetsValue}</h6>
        {/* <h6>Current Wallet + Non Sold Assets : {card.allAssetsValue}</h6> */}
        <h6>Margin : {card.margin} %</h6>
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
    setBestAndLeastAssetsGain();
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

        {/* Dashboard Links */}
        <div className="flex align-items-center justify-content-end">
          <Button
            label="Transactions"
            severity="info"
            size="small"
            rounded
            className="mr-5 mb-5"
            onClick={() => router.push(`/wallets/${wallet.name}/transactions`)}
          />
          <Button
            label="Assets"
            severity="info"
            size="small"
            rounded
            className="mr-5 mb-5"
            onClick={() => router.push(`/wallets/${wallet.name}/assets`)}
          />
        </div>

        {/* Dashboard Cards */}
        <div className="flex align-items-center justify-content-center text-center">
          {walletCard(walletCardInfo)}
          {cardsInfo.map((card) => infoCard(card))}
        </div>

        {/* Dashboard Data */}
        <div className="flex flex-column align-items-center justify-content-center text-center">

          {/* Dashboard Assets + PieCharts */}
          <div className="flex align-items-center justify-content-center text-center mb-5">
            {/* Dashboard Assets */}
            <div className="flex flex-column align-items-center justify-content-center text-center">
            {bestAssets.length > 0 && <div className="card">
                <h3> Top Gain Assets</h3>
                <AssetDataTable assets={bestAssets} HandleSellButton={null} />
              </div>}
              {leastAssets.length > 0 && <div className="card">
                <h3> Top Loss Assets</h3>
                <AssetDataTable assets={leastAssets} HandleSellButton={null} />
              </div>}
            </div>
            {/* Dashboard PieCharts */}
            <div className="flex flex-column align-items-center justify-content-center text-center mx-5">
              <div className="card ">
                <h3> Balance</h3>
                <PieChart pieData={[
                  {name: "Intial Value ($)", value:parseFloat(wallet.intialValue).toFixed(2)},
                  {name: "Current Value ($)",value:parseFloat(wallet.currentValue).toFixed(2)},
                  {name: "Non Sold Assets Value ($) ",value:nonSoldAssetsValue.toFixed(2)}
                  ]} />
                  <h5 style={{
                    color: margin > 0 ? "green" : "red"
                  }}
                  >{margin > 0 ? "Gain" : "Loss"} : {margin} % ({marginUSD} $)</h5>
              </div>
              <div className="card ">
                <h3> Coin In Stock</h3>
                <PieChart pieData={walletCoinList} />
              </div>
            </div>
          </div>

          {/* Dashboard Transactions */}
          {walletTransactions.length > 0 && <div className="card">
            <h3> Lastest Transactions</h3>
            <TransactionDataTable
              transactions={walletTransactions
                .sort(
                  (a: Transaction, b: Transaction) =>
                    ((new Date(b.createdAt) as any) -
                      new Date(a.createdAt)) as any
                )
                .slice(0, 5)}
              symbols={symbols}
              displayHeader={false}
            />
          </div>}
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

    // get user wallet
    const walletName = context.params.walletName;
    const wallet: Wallet = await getWalletByName(token, walletName);

    // get wallet transactions
    const transactionQuery = { coinImage: true, wallet: walletName };
    let walletTransactions: Transaction[] = await getTransactions(
      token,
      transactionQuery
    );

    let symbols = [];

    for (let transaction of walletTransactions
      .sort(
        (a: Transaction, b: Transaction) =>
          ((new Date(b.createdAt) as any) - new Date(a.createdAt)) as any
      )
      .slice(0, 5)) {
      let symbol = {
        name: transaction.symbol,
        coinImage: transaction.coinImage,
      };
      if (
        symbols.filter((symbol) => symbol.name === transaction.symbol)
          .length === 0
      ) {
        symbols.push(symbol);
      }

      transaction.symbol = symbol;
      transaction.totalValue = transaction.value;
      transaction.date = transaction.createdAt;
      delete transaction.value;
    }

    // get wallet assets and calculate non sold assets values
    const assetQuery = { name: walletName };
    const walletAssets: Asset[] | undefined = await getAssets(
      token,
      assetQuery
    );

    let walletCoinList = [];
    let nonSoldAssetsValue = 0
    for (let asset of walletAssets!) {
      if (asset.boughtAmount - asset.soldAmount > 0) {
        walletCoinList.push({
          name: asset.name,
          value: asset.boughtAmount - asset.soldAmount,
        });

        // Check if coin is updated in the last hour in order to minimize coinranking api usage
        const assetCoin : CryptoCoin = await getCoinByName(token, asset.name)
        const currentTime = new Date();
        const coinLastUpdateTime = new Date(assetCoin.updatedAt);
        const timeDifference = currentTime - coinLastUpdateTime;
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference > 1) {
          const currentCoin : CryptoCoin = await getCoin(token, assetCoin.id)
          nonSoldAssetsValue = nonSoldAssetsValue + (asset.boughtAmount - asset.soldAmount) * +currentCoin.price
        }
        else{
          nonSoldAssetsValue = nonSoldAssetsValue + (asset.boughtAmount - asset.soldAmount) * +assetCoin.price
        }

      }
    }

    // get wallet transactions and assets by date
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
        symbols,
        walletCoinList,
        nonSoldAssetsValue,
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
