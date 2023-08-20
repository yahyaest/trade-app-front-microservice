/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import { GetServerSideProps } from "next";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { DataView } from "primereact/dataview";
import { getUserWallets } from "@/services";
import { Wallet } from "@/models/wallet";
import { Tag } from "primereact/tag";
import AddWalletModal from "@/components/addWalletModal";
import { Page } from "../../types/types";
import AppConfig from "../../layout/AppConfig";
import "primeflex/primeflex.css";
import { formatCurrency } from "@/utils/utils";
import { BreadCrumb } from "primereact/breadcrumb";

const WalletsPage: Page = (props: any) => {
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

  const handleCreateWalletButton = async () => {
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
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
          <img
            className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
            src={`/images/${wallet.type.toLowerCase()}_wallet.png`}
            alt={wallet.name}
          />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{wallet.name}</div>
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
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="text-2xl font-semibold mt-3">
                {formatCurrency(wallet.currentValue)}
              </span>
              <Button
              className= "mt-3"
                label="Wallet Dashboard"
                size="small"
                icon="pi pi-wallet"
                severity="danger"
                onClick={() => {
                  router.push(`/wallets/${wallet.name}`);
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
        <h1>Wallets Page</h1>
        <Toast ref={toast} />
        <BreadCrumb model={items as any} home={home} className="mb-3" />
        <Button
          label="Create Wallet"
          severity="info"
          size="small"
          rounded
          className="mr-5 mb-5"
          style={{ float: "right" }}
          onClick={() => handleCreateWalletButton()}
        />
        <div className="card">
          <DataView value={wallets} itemTemplate={itemTemplate} />
        </div>
      </div>
    </React.Fragment>
  );
};

WalletsPage.getLayout = function getLayout(page) {
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

    const wallets: Wallet[] = await getUserWallets(token);

    return {
      props: { wallets, error: null },
    };
  } catch (error: any) {
    return {
      props: { error: error.message },
    };
  }
};

export default WalletsPage;
