/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Page } from "../../../types/types";
import AppConfig from "../../../layout/AppConfig";
import { formatCurrency } from "@/utils/utils";
import { CustomLogger } from "@/utils/logger";
import WalletClient from "@/services/wallet";
import CryptoClient from "@/services/crypto";
import { Wallet } from "@/models/wallet";
import { Transaction } from "@/models/transaction";
import { Asset } from "@/models/asset";
import { CryptoCoin } from "@/models/cryptoCoin";
import { WalletHistory } from "@/models/walletHistory";
import AssetDataTable from "@/components/assetDataTable";
import TransactionDataTable from "@/components/transactionDataTable";
import PieChart from "@/components/pieChart";
import WalletHistoryChart from "@/components/walletHistoryChart";
import { BreadCrumb } from "primereact/breadcrumb";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import styles from "./walletDashboard.module.css";
import "primeflex/primeflex.css";

const WalletPage: Page = (props: any) => {
  const {
    symbols,
    walletCoinList,
    nonSoldAssetsValue,
    walletChartData,
    error,
  } = props;
  const wallet: Wallet = props.wallet;
  const walletTransactions: Transaction[] = props.walletTransactions;
  const walletAssets: Asset[] = props.walletAssets;
  const { lastWeekTransactionsNumber, lastWeekAssetsNumber } = props;
  const [bestAssets, setBestAssets] = useState<Asset[]>([]);
  const [leastAssets, setLeastAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [windowSize, setWindowSize] = useState<string>("xlg");
  const margin = (
    ((+wallet?.currentValue + nonSoldAssetsValue - +wallet?.intialValue) /
      +wallet?.intialValue) *
    100
  ).toFixed(2);
  const marginUSD = (+wallet?.intialValue / 100) * Math.abs(+margin);

  // Function to handle screen width change
  const handleScreenChange = () => {
    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1200) {
        setWindowSize("xlg");
      } else if (screenWidth >= 992) {
        setWindowSize("lg");
      } else if (screenWidth >= 768) {
        setWindowSize("md");
      } else if (screenWidth >= 576) {
        setWindowSize("sm");
      } else {
        setWindowSize("xsm");
      }
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("resize", handleScreenChange);
  }

  const setBestAndLeastAssetsGain = () => {
    const soldAssets = walletAssets?.filter(
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

  const router = useRouter();
  const toast: any = useRef(null);

  const items = wallet
    ? [{ label: `wallets`, url: `/wallets` }, { label: `${wallet.name}` }]
    : null;
  const home = { icon: "pi pi-home", label: "icons", url: "/" };

  useEffect(() => {
    if (wallet) setLoading(false);
    setBestAndLeastAssetsGain();
    handleScreenChange();
  }, []);

  const walletCardInfo = {
    label: "Balance",
    balance: formatCurrency(+wallet?.currentValue + nonSoldAssetsValue),
    intial: formatCurrency(wallet?.intialValue),
    margin: margin,
    marginUSD: marginUSD,
  };

  const cardsInfo = [
    {
      label: "Assets",
      number: walletAssets?.length,
      data: walletAssets,
      lastWeek: lastWeekAssetsNumber,
    },
    {
      label: "Transactions",
      number: walletTransactions?.length,
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
            {card.data
              .sort(
                (a: Transaction, b: Transaction) =>
                  (new Date(b.createdAt) as any) -
                  (new Date(a.createdAt) as any)
              )
              .slice(0, 4)
              .map((e: Asset | Transaction) => {
                if ("walletId" in e) {
                  return (
                    <Avatar
                      key={e.id}
                      image={`${e.transactions[0].coinImage}`}
                      size="large"
                      shape="circle"
                    />
                  );
                } else
                  return (
                    <Avatar
                      key={e.id}
                      image={`${e.coinImage}`}
                      size="large"
                      shape="circle"
                    />
                  );
              })}
            <Avatar
              label={`+${card.data.length - 4}`}
              shape="circle"
              size="large"
              style={{ backgroundColor: "#9c27b0", color: "#ffffff" }}
            />
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
        className={` ${styles.infoCard} m-5 text-center flex flex-column justify-content-center align-items-center`}
      >
        <h3>{card.label}</h3>
        <h1 className="my-1">{card.balance}</h1>
        <p className="my-1">(Intial {card.intial})</p>
        <div className="flex justify-content-center align-items-center my-1">
          <i
            className={`pi ${
              card.margin > 0 ? "pi-arrow-up" : "pi-arrow-down"
            } mx-2`}
            style={{
              color: card.margin > 0 ? "green" : "red",
              fontSize: "2rem",
            }}
          ></i>
          <h3 style={{ color: card.margin > 0 ? "green" : "red" }}>
            {" "}
            {card.margin > 0 ? "+" : "-"} {Math.abs(card.margin).toFixed(2)} %
          </h3>
          <p className="mx-2 mt-2"> ({marginUSD.toFixed(2)} $)</p>
        </div>
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

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen min-w-screen overflow-hidden">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="surface-ground align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden text-center">
        <Toast ref={toast} />
        <BreadCrumb model={items as any} home={home} className="my-3" />
        <h1 className="font-bold text-3xl sm:text-6xl text-yellow-500">{`${wallet.name} Dashboard`}</h1>

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
          <Button
            label="Trade"
            severity="info"
            size="small"
            rounded
            className="mr-5 mb-5"
            onClick={() => router.push(`/coins`)}
          />
        </div>

        {/* Dashboard Cards */}
        <div className="flex flex-wrap align-items-center justify-content-center text-center">
          {walletCard(walletCardInfo)}
          {cardsInfo.map((card) => infoCard(card))}
        </div>

        {/* Dashboard Chart */}
        <div className="mx-5">
          <WalletHistoryChart walletChartData={walletChartData} />
        </div>

        {/* Dashboard Data */}
        <div className="flex flex-column justify-content-center text-center">
          {/* Dashboard Assets + PieCharts */}
          {windowSize === "xlg" && (
            <div className="flex align-items-center text-center mb-5">
              {/* Dashboard Assets */}
              <div className="flex flex-column align-items-center text-center mx-5">
                {bestAssets.length > 0 && (
                  <div className="card">
                    <h3 className="text-900 text-green-600 font-bold">
                      {" "}
                      Top Gain Assets
                    </h3>
                    <AssetDataTable
                      assets={bestAssets}
                      HandleSellButton={null}
                      options={{
                        header: false,
                        colType: false,
                        colWalletName: false,
                      }}
                    />
                  </div>
                )}
                {leastAssets.length > 0 && (
                  <div className="card">
                    <h3 className="text-900 text-red-500 font-bold">
                      {" "}
                      Top Loss Assets
                    </h3>
                    <AssetDataTable
                      assets={leastAssets}
                      HandleSellButton={null}
                      options={{
                        header: false,
                        colType: false,
                        colWalletName: false,
                      }}
                    />
                  </div>
                )}
              </div>
              {/* Dashboard PieCharts */}
              <div className="flex flex-column align-items-center justify-content-center text-center mx-5">
                <div className="card ">
                  <h3 className="text-900 text-blue-600 font-bold"> Balance</h3>
                  <PieChart
                    pieData={[
                      {
                        name: "Intial Value ($)",
                        value: parseFloat(wallet.intialValue).toFixed(2),
                      },
                      {
                        name: "Current Value ($)",
                        value: parseFloat(wallet.currentValue).toFixed(2),
                      },
                      {
                        name: "Non Sold Assets Value ($) ",
                        value: nonSoldAssetsValue.toFixed(2),
                      },
                    ]}
                  />
                </div>
                <div className="card ">
                  <h3 className="text-900 text-blue-600 font-bold">
                    {" "}
                    Coins In Stock
                  </h3>
                  <PieChart pieData={walletCoinList} />
                </div>
              </div>
            </div>
          )}

          {windowSize === "lg" && (
            <div className="flex flex-column justify-content-center text-center mb-5">
              {/* Dashboard PieCharts */}
              <div className="flex flex align-items-center justify-content-center text-center m-5 ">
                <div className="card mr-3 mt-5">
                  <h3 className="text-900 text-blue-600 font-bold"> Balance</h3>
                  <PieChart
                    pieData={[
                      {
                        name: "Intial Value ($)",
                        value: parseFloat(wallet.intialValue).toFixed(2),
                      },
                      {
                        name: "Current Value ($)",
                        value: parseFloat(wallet.currentValue).toFixed(2),
                      },
                      {
                        name: "Non Sold Assets Value ($) ",
                        value: nonSoldAssetsValue.toFixed(2),
                      },
                    ]}
                  />
                </div>
                <div className="card ml-3">
                  <h3 className="text-900 text-blue-600 font-bold">
                    {" "}
                    Coins In Stock
                  </h3>
                  <PieChart pieData={walletCoinList} />
                </div>
              </div>
              {/* Dashboard Assets */}
              <div className="flex flex-column justify-content-center text-center mx-5">
                {bestAssets.length > 0 && (
                  <div className="card">
                    <h3 className="text-900 text-green-600 font-bold">
                      {" "}
                      Top Gain Assets
                    </h3>
                    <AssetDataTable
                      assets={bestAssets}
                      HandleSellButton={null}
                      options={{
                        header: false,
                        colType: false,
                        colWalletName: false,
                      }}
                    />
                  </div>
                )}
                {leastAssets.length > 0 && (
                  <div className="card">
                    <h3 className="text-900 text-red-500 font-bold">
                      {" "}
                      Top Loss Assets
                    </h3>
                    <AssetDataTable
                      assets={leastAssets}
                      HandleSellButton={null}
                      options={{
                        header: false,
                        colType: false,
                        colWalletName: false,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {(windowSize === "md" ||
            windowSize === "sm" ||
            windowSize === "xsm") && (
            <div className="flex flex-column justify-content-center text-center mb-5">
              {/* Dashboard PieCharts */}
              <div className="flex flex flex-column align-items-center justify-content-center text-center m-5 ">
                <div className="card">
                  <h3 className="text-900 text-blue-600 font-bold"> Balance</h3>
                  <PieChart
                    pieData={[
                      {
                        name: "Intial Value ($)",
                        value: parseFloat(wallet.intialValue).toFixed(2),
                      },
                      {
                        name: "Current Value ($)",
                        value: parseFloat(wallet.currentValue).toFixed(2),
                      },
                      {
                        name: "Non Sold Assets Value ($) ",
                        value: nonSoldAssetsValue.toFixed(2),
                      },
                    ]}
                  />
                </div>
                <div className="card">
                  <h3 className="text-900 text-blue-600 font-bold">
                    {" "}
                    Coins In Stock
                  </h3>
                  <PieChart pieData={walletCoinList} />
                </div>
              </div>
              {/* Dashboard Assets */}
              <div className="flex flex-column justify-content-center text-center mx-5">
                {bestAssets.length > 0 && (
                  <div className="card">
                    <h3 className="text-900 text-green-600 font-bold">
                      {" "}
                      Top Gain Assets
                    </h3>
                    <AssetDataTable
                      assets={bestAssets}
                      HandleSellButton={null}
                      options={{
                        header: false,
                        colType: false,
                        colWalletName: false,
                      }}
                    />
                  </div>
                )}
                {leastAssets.length > 0 && (
                  <div className="card">
                    <h3 className="text-900 text-red-500 font-bold">
                      {" "}
                      Top Loss Assets
                    </h3>
                    <AssetDataTable
                      assets={leastAssets}
                      HandleSellButton={null}
                      options={{
                        header: false,
                        colType: false,
                        colWalletName: false,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dashboard Transactions */}
          {walletTransactions.length > 0 && (
            <div className="card mx-5">
              <h3 className="text-900 text-blue-600 font-bold">
                {" "}
                Lastest Transactions
              </h3>
              <TransactionDataTable
                transactions={walletTransactions
                  .sort(
                    (a: Transaction, b: Transaction) =>
                      (new Date(b.createdAt) as any) -
                      (new Date(a.createdAt) as any)
                  )
                  .slice(0, 5)}
                symbols={symbols}
                displayHeader={false}
              />
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

// WalletPage.getLayout = function getLayout(page) {
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
    const user = context.req.cookies["user"];
    const username = JSON.parse(user).email;
    const cryptoClientSource = "server";
    const walletClientSource = "server";
    const walletClient = new WalletClient(walletClientSource);
    const cryptoClient = new CryptoClient(cryptoClientSource);

    if (!token) {
      logger.warn("No token was provided. Redirecting to login page");
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    // get user wallet
    const walletName = context.params.walletName;
    logger.info(`Preparing dashboard data for wallet ${walletName}...`);
    logger.info(`Fetching wallet ${walletName}...`);
    const wallet: Wallet = await walletClient.getWalletByName(
      token,
      walletName
    );

    if (wallet) {
      logger.info(
        `Successfully fetched wallet ${walletName} : ${JSON.stringify(wallet)}`
      );
    }

    // get wallet transactions
    const transactionQuery = { coinImage: true, wallet: walletName };
    logger.info(`Fetching transactions for wallet ${walletName}...`);
    let walletTransactions: Transaction[] = await cryptoClient.getTransactions(
      token,
      transactionQuery
    );

    let symbols = [];

    for (let transaction of walletTransactions
      .sort(
        (a: Transaction, b: Transaction) =>
          (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any)
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

    if (walletTransactions) {
      logger.info(
        `Successfully fetched ${walletTransactions.length} transactions for wallet ${walletName}`
      );
    }

    // get wallet assets and calculate non sold assets values
    const assetQuery = { name: walletName };

    logger.info(`Fetching assets for wallet ${walletName}...`);
    const walletAssets: Asset[] | undefined = await walletClient.getAssets(
      token,
      assetQuery
    );

    if (walletAssets) {
      logger.info(
        `Successfully fetched ${walletAssets.length} assets for wallet ${walletName}`
      );
    }

    let walletCoinList = [];
    let nonSoldAssetsValue = 0;
    for (let asset of walletAssets!) {
      if (asset.boughtAmount - asset.soldAmount > 0) {
        walletCoinList.push({
          name: asset.name,
          value: asset.boughtAmount - asset.soldAmount,
        });

        // Check if coin is updated in the last hour in order to minimize coinranking api usage
        const assetCoin: CryptoCoin = await cryptoClient.getCoinByName(
          token,
          asset.name
        );
        logger.info(
          `Adding ${asset.boughtAmount - asset.soldAmount} ${
            asset.name
          } coins with unit price ${assetCoin.price} to wallet coin list...`
        );
        const currentTime = new Date();
        const coinLastUpdateTime = new Date(assetCoin.updatedAt);
        const timeDifference =
          (currentTime as any) - (coinLastUpdateTime as any);
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference > 1) {
          let currentCoin: CryptoCoin = await cryptoClient.getCoin(
            token,
            assetCoin.id
          );
          if (!currentCoin) {
            logger.warn(
              `Failed to retreive ${assetCoin.name} current data from "api.coinranking.com".Using latest saved coin data ...`
            );
            currentCoin = assetCoin;
          }
          logger.info(
            `Successfully fetched ${
              assetCoin.name
            } coin data : ${JSON.stringify(currentCoin)}`
          );
          nonSoldAssetsValue =
            nonSoldAssetsValue +
            (asset.boughtAmount - asset.soldAmount) * +currentCoin.price;
        } else {
          nonSoldAssetsValue =
            nonSoldAssetsValue +
            (asset.boughtAmount - asset.soldAmount) * +assetCoin.price;
        }
      }
    }
    logger.info(`Non sold assets value: ${nonSoldAssetsValue}`);

    // get wallet transactions and assets by date
    const lastWeekTransactionQuery = { wallet: walletName, days: "7" };
    logger.info(`Fetching last week transactions for wallet ${walletName}...`);
    const lastWeekWalletTransactions: Transaction[] =
      await cryptoClient.getTransactions(token, lastWeekTransactionQuery);

    logger.info(
      `Found ${lastWeekWalletTransactions.length} transactions for wallet ${walletName} in the last week`
    );
    logger.info(`Fetching last week assets for wallet ${walletName}...`);
    const lastWeekAssetQuery = { walletName, days: "7" };
    const lastWeekWalletAssets: Asset[] = await walletClient.getAssetsByQuery(
      token,
      lastWeekAssetQuery
    );
    logger.info(
      `Found ${lastWeekWalletAssets.length} assets for wallet ${walletName} in the last week`
    );

    // get wallet history data
    logger.info(`Fetching wallet history data for wallet ${walletName}...`);
    let walletHistoryData: WalletHistory[] =
      await walletClient.getWalletHistory(token, {
        walletName: wallet.name,
        username,
      });
    walletHistoryData = walletHistoryData.sort(
      (a: WalletHistory, b: WalletHistory) =>
        (new Date(a.createdAt) as any) - (new Date(b.createdAt) as any)
    );

    logger.info(
      `Found ${walletHistoryData.length} history data point for wallet ${walletName}`
    );

    // add new wallet history data
    const currentTime = new Date();
    const lastAddedHistory =
      walletHistoryData.length > 0
        ? new Date(walletHistoryData[walletHistoryData.length - 1].createdAt)
        : new Date();
    const timeDifference = (currentTime as any) - (lastAddedHistory as any);
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference > 3 || walletHistoryData.length === 0) {
      const margin = (
        ((+wallet.currentValue + nonSoldAssetsValue - +wallet.intialValue) /
          +wallet.intialValue) *
        100
      ).toFixed(2);
      const marginAmount = (+wallet.intialValue / 100) * +margin;

      const payload = {
        username: username,
        walletName: walletName,
        walletId: wallet.id,
        intialValue: +wallet.intialValue,
        currentValue: +wallet.currentValue,
        nonSoldAssetsValue: nonSoldAssetsValue,
        margin: +margin,
        marginAmount,
      };

      logger.info(
        `Adding new wallet history data point for wallet ${walletName} with payload: ${JSON.stringify(
          payload
        )}`
      );

      await walletClient.addWalletHistory(token, payload);
      logger.info(
        `Successfully added new wallet history data point for wallet ${walletName}`
      );
    }

    // set wallet chart data
    let timeData = [];
    let valueData = [];
    let marginData = [];
    for (let e of walletHistoryData) {
      timeData.push(e.createdAt);
      valueData.push(e.currentValue + e.nonSoldAssetsValue);
      marginData.push(e.margin);
    }
    const walletChartData = {
      time: timeData,
      value: valueData,
      margin: marginData,
    };

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
        walletHistoryData,
        walletChartData,
        error: null,
      },
    };
  } catch (error: any) {
    logger.error(`Error fetching wallet dashboard data: ${error.message}`);
    return {
      props: { error: error.message },
    };
  }
};

export default WalletPage;
