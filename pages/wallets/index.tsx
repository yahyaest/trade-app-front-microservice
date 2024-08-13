/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Page } from "../../types/types";
import { CustomLogger } from "@/utils/logger";
import { formatCurrency } from "@/utils/utils";
import AppConfig from "../../layout/AppConfig";
import WalletClient from "@/services/wallet";
import NotificationClient from "@/services/notification";
import AddWalletModal from "@/components/addWalletModal";
import { User } from "@/models/user";
import { Wallet } from "@/models/wallet";
import { Notification } from "@/models/notification";
import "primeflex/primeflex.css";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";

const WalletsPage: Page = (props: any) => {
  const notificationClient = new NotificationClient();
  const { error } = props;
  const wallets: Wallet[] = props.wallets;

  const [loading, setLoading] = useState<boolean>(true);
  const [isModal, setIsModal] = useState<boolean>(false);

  const router = useRouter();
  const toast: any = useRef(null);

  const items = wallets ? [{ label: `wallets` }] : null;
  const home = { icon: "pi pi-home", label: "icons", url: "/" };

  const errorToast = (error: any) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  };

  const createNotification = async (message: string, title: string) => {
    const user: User = Cookies.get("user")
      ? JSON.parse(Cookies.get("user") as string)
      : null;
    if (!user) return;
    const notificationPayload: Notification = {
      message,
      sender: user.email,
      title,
      userId: user.id,
      username: user.username,
      userEmail: user.email,
      userImage: (user.avatarUrl as string).split("/")[3],
    };
    return notificationClient.addUserNotification(notificationPayload);
  };

  const handleCreateWalletButton = async () => {
    await createNotification(
      "User clicked on create wallet button",
      "Create Wallet"
    );
    setIsModal(true);
  };

  useEffect(() => {
    if (wallets) setLoading(false);
  }, []);

  const getTypeSeverity = (type: string) => {
    switch (type) {
      case "FOREX":
        return "danger";

      case "STOCK":
        return "success";

      case "CRYPTO":
        return "info";
    }
  };

  const itemTemplate = (wallet: Wallet) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 w-20rem sm:w-full">
          <img
            className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
            src={`/images/${wallet.type.toLowerCase()}_wallet.png`}
            alt={wallet.name}
          />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-pink-600">
                {wallet.name}
              </div>
              <p>{wallet.createdAt.split("T")[0]}</p>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-tag"></i>
                  <span className="font-semibold">
                    {formatCurrency(wallet.intialValue)}
                  </span>
                </span>
                <Tag
                  value={wallet.type}
                  severity={getTypeSeverity(wallet.type)}
                ></Tag>
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-2 sm:gap-2">
              <span className="text-md font-normal sm:text-2xl sm:font-semibold mt-3">
                {formatCurrency(wallet.currentValue)}
              </span>
              <Button
                className="mt-3"
                label="Wallet Dashboard"
                size="small"
                icon="pi pi-wallet"
                severity="danger"
                onClick={() => {
                  router.push(`/wallets/${wallet.name}`);
                  setLoading(true);
                }}
                rounded
              ></Button>
            </div>
          </div>
        </div>
      </div>
    );
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

  if (loading)
    return (
      <div className="flex justify-content-center align-items-center min-h-screen min-w-screen overflow-hidden">
        <ProgressSpinner />
      </div>
    );

  return (
    <React.Fragment>
      {isModal && (
        <AddWalletModal
          visible={isModal}
          setVisible={setIsModal}
          wallets={wallets}
          toast={toast}
        />
      )}
      <div className="surface-ground align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden text-center">
        <Toast ref={toast} />
        <BreadCrumb model={items as any} home={home} className="my-3" />
        <h1 className="font-bold text-xl2 text-yellow-500">Your Wallets</h1>
        <Button
          label="Create Wallet"
          severity="info"
          size="small"
          rounded
          className="mr-5 mb-5"
          style={{ float: "right" }}
          onClick={() => handleCreateWalletButton()}
        />
        <div className="card m-5 sm:m-7">
          <DataView value={wallets} itemTemplate={itemTemplate} />
        </div>
      </div>
    </React.Fragment>
  );
};

// WalletsPage.getLayout = function getLayout(page) {
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
    const walletClient = new WalletClient();
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

    logger.info("Fetching user wallets...");
    const wallets: Wallet[] = await walletClient.getUserWallets(token);
    logger.info(`Successfully fetched ${wallets.length} wallets`);
    logger.info(`Fetched wallets: ${JSON.stringify(wallets)}`);

    return {
      props: { wallets, error: null },
    };
  } catch (error: any) {
    logger.error(`Error fetching coins data: ${error.message}`);
    return {
      props: { error: error.message },
    };
  }
};

export default WalletsPage;
