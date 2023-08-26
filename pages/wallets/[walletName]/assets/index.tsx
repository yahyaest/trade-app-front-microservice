/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { ProgressSpinner } from "primereact/progressspinner";
import { Page } from "../../../../types/types";
import AppConfig from "../../../../layout/AppConfig";
import { getAssets } from "@/services";
import { Toast } from "primereact/toast";
import SellCoinModal from "@/components/sellCoinModal";
import { Asset } from "@/models/asset";
import { BreadCrumb } from "primereact/breadcrumb";
import AssetDataTable from "@/components/assetDataTable";

const AssetsPage: Page = (props: any) => {
  const { walletName, error } = props;
  const assets: Asset[] = props.assets;

  const [assetsList, setAssetsList] = useState<Asset[]>(assets);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [coinData, setCoinData] = useState<any>(null);

  const toast: any = useRef(null);

  const errorToast = () => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  };

  const items = assets
    ? [
        { label: `wallets`, url: "/wallets" },
        { label: `${walletName}`, url: `/wallets/${walletName}` },
        { label: `assets` },
      ]
    : null;
  const home = { icon: "pi pi-home", label: "icons", url: "/" };

  useEffect(() => {
    if (assetsList) setLoading(false);
  }, []);

  const HandleSellButton = (rowData: Asset) => {
    setIsModal(true);
    setCoinData(rowData);
  };

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

  if (loading)
    return (
      <div className="flex justify-content-center align-items-center min-h-screen min-w-screen overflow-hidden">
        <ProgressSpinner />
      </div>
    );

  return (
    <React.Fragment>
      {isModal && (
        <SellCoinModal
          visible={isModal}
          setVisible={setIsModal}
          data={coinData}
          toast={toast}
        />
      )}
      <div className="surface-ground align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden text-center">
        <h1>Assets Page</h1>
        <Toast ref={toast} />
        <BreadCrumb model={items as any} home={home} />
        <div className="card">
          <AssetDataTable
            assets={assets}
            HandleSellButton={HandleSellButton}
            options={{ header: true, colType: true, colWalletName: true }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

AssetsPage.getLayout = function getLayout(page) {
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
    const query = { name: walletName };
    const assets: Asset[] | undefined = await getAssets(token, query);

    return {
      props: { assets, walletName, error: null },
    };
  } catch (error: any) {
    console.log("error type  : ", error.message);
    return { props: { error: error.message } };
  }
};

export default AssetsPage;
