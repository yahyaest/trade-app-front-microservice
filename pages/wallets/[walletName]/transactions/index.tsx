/* eslint-disable @next/next/no-img-element */

import React, { useRef } from "react";
import { GetServerSideProps } from "next";
import { Page } from "../../../../types/types";
import AppConfig from "../../../../layout/AppConfig";
import { CustomLogger } from "@/utils/logger";
import CryptoClient from "@/services/crypto";
import TransactionDataTable from "@/components/transactionDataTable";
import { Transaction } from "@/models/transaction";
import { BreadCrumb } from "primereact/breadcrumb";
import { Toast } from "primereact/toast";

const TransactionsPage: Page = (props: any) => {
  const { symbols, walletName, error } = props;
  const transactions: Transaction[] = props.transactions;
  const toast: any = useRef(null);

  const errorToast = () => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  };

  const items = transactions
    ? [
        { label: `wallets`, url: "/wallets" },
        { label: `${walletName}`, url: `/wallets/${walletName}` },
        { label: `transactions` },
      ]
    : null;
  const home = { icon: "pi pi-home", label: "icons", url: "/" };

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

  return (
    <div className="surface-ground align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden text-center">
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <BreadCrumb model={items as any} home={home} className="my-3" />
            <h5 className="font-bold text-3xl sm:text-6xl text-yellow-500">
              Transactions
            </h5>
            <TransactionDataTable
              transactions={transactions.sort(
                (a: Transaction, b: Transaction) =>
                  (new Date(b.createdAt) as any) -
                  (new Date(a.createdAt) as any)
              )}
              symbols={symbols}
              displayHeader={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// TransactionsPage.getLayout = function getLayout(page) {
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
    const cryptoClient = new CryptoClient();
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

    const wallet = context.params.walletName;
    const query = { coinImage: true, wallet };
    logger.info(`Fetching transactions for wallet ${wallet}...`);
    const transactions: Transaction[] = await cryptoClient.getTransactions(
      token,
      query
    );
    logger.info(
      `Successfully fetched ${transactions.length} transactions for wallet ${wallet}`
    );

    // Update transactions for table filters
    logger.info("Updating transactions for table filters...");

    let symbols = [];

    for (let transaction of transactions) {
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

    return {
      props: { transactions, symbols, walletName: wallet, error: null },
    };
  } catch (error: any) {
    logger.error(`Error fetching coins data: ${error.message}`);
    return { props: { error: error.message } };
  }
};

export default TransactionsPage;
