/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Page } from "../../../../types/types";
import AppConfig from "../../../../layout/AppConfig";
import { getAssets } from "@/services";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatCurrency } from "@/utils/utils";
import SellCoinModal from "@/components/sellCoinModal";
import { Asset } from "@/models/asset";
import { Transaction } from "@/models/transaction";
import { BreadCrumb } from "primereact/breadcrumb";

const AssetsPage: Page = (props: any) => {
  const { walletName, error } = props;
  const assets: Asset[] = props.assets;

  const [assetsList, setAssetsList] = useState<Asset[]>(assets);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRows, setExpandedRows] = useState(null);
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

  const onRowExpand = (event: any) => {
    toast.current?.show({
      severity: "info",
      summary: "Asset Expanded",
      detail: event.data.name,
      life: 3000,
    });
  };

  const onRowCollapse = (event: any) => {
    toast.current?.show({
      severity: "success",
      summary: "Asset Collapsed",
      detail: event.data.name,
      life: 3000,
    });
  };

  const expandAll = () => {
    let _expandedRows: any = {};

    assets.forEach((p) => (_expandedRows[`${p.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const transactionValueBodyTemplate = (rowData: Transaction) => {
    return formatCurrency(rowData.value);
  };

  const transactionUnitPriceBodyTemplate = (rowData: Transaction) => {
    return formatCurrency(rowData.unit_price);
  };

  const imageBodyTemplate = (rowData: Asset) => {
    return (
      <a href={`/coins/${rowData.name}`}>
        <img
          src={`${rowData.transactions[0].coinImage}`}
          alt={rowData.transactions[0].coinImage}
          width="50px"
        />
      </a>
    );
  };

  const boughtAtBodyTemplate = (rowData: Asset) => {
    return formatCurrency(rowData.boughtAt);
  };

  const soldAtBodyTemplate = (rowData: Asset) => {
    return formatCurrency(rowData.soldAt);
  };

  const typeBodyTemplate = (rowData: Asset) => {
    return (
      <Tag
        value={rowData.type}
        severity={getTypeSeverity(rowData) as any}
      ></Tag>
    );
  };

  const actionBodyTemplate = (rowData: Transaction) => {
    return (
      <Tag value={rowData.action} severity={getActionSeverity(rowData)}></Tag>
    );
  };

  const sellBodyTemplate = (rowData: Asset) => {
    if (rowData.soldAmount < rowData.boughtAmount) {
      return (
        <Button
          label="Sell"
          severity="success"
          size="small"
          rounded
          onClick={() => HandleSellButton(rowData)}
        />
      );
    } else if (rowData.soldAmount === rowData.boughtAmount) {
      const gain = (
        ((+rowData.soldAt - +rowData.boughtAt) / +rowData.boughtAt) *
        100
      ).toFixed(2);
      return (
        <div
          className={`text-xl`}
          style={{ color: `${+gain > 0 ? "green" : "red"}` }}
        >
          {+gain > 0 && "+"}
          {gain}%
        </div>
      );
    } else return <React.Fragment></React.Fragment>;
  };

  const getTypeSeverity = (rowData: Asset) => {
    switch (rowData.type) {
      case "CRYPTO":
        return "secondary";

      case "STOCK":
        return "warning";

      case "FOREX":
        return "danger";
    }
  };

  const getActionSeverity = (rowData: Transaction) => {
    switch (rowData.action) {
      case "BUY":
        return "success";

      case "SELL":
        return "info";
    }
  };

  const allowExpansion = (rowData: Asset) => {
    return rowData.transactions.length > 0;
  };

  const rowExpansionTemplate = (data: Asset) => {
    return (
      <div className="p-3">
        <h5>Transactions for {data.name}</h5>
        <DataTable value={data.transactions}>
          <Column field="name" header="Name" sortable></Column>
          <Column field="symbol" header="Symbol" sortable></Column>
          <Column field="amount" header="Amount" sortable></Column>
          <Column
            field="unit_price"
            header="Unit Price"
            body={transactionUnitPriceBodyTemplate}
            sortable
          ></Column>
          <Column
            field="value"
            header="Total Value"
            body={transactionValueBodyTemplate}
            sortable
          ></Column>
          <Column
            field="action"
            header="Action"
            body={actionBodyTemplate}
            sortable
          ></Column>
          <Column
            field="type"
            header="Type"
            body={typeBodyTemplate}
            sortable
          ></Column>
        </DataTable>
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
      <Button
        icon="pi pi-minus"
        label="Collapse All"
        onClick={collapseAll}
        text
      />
    </div>
  );

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
          <DataTable
            value={assets}
            expandedRows={expandedRows as any}
            onRowToggle={(e) => setExpandedRows(e.data as any)}
            onRowExpand={onRowExpand}
            onRowCollapse={onRowCollapse}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="id"
            emptyMessage="No Assets found."
            header={header}
            tableStyle={{ minWidth: "60rem" }}
          >
            <Column expander={allowExpansion} style={{ width: "5rem" }} />
            <Column field="walletName" header="Wallet Name" sortable />
            <Column field="name" header="Name" sortable />
            <Column field="symbol" header="Symbol" sortable />
            <Column header="Image" body={imageBodyTemplate} />
            <Column field="boughtAmount" header="Bought Amount" sortable />
            <Column
              field="boughtAt"
              header="Bought At"
              sortable
              body={boughtAtBodyTemplate}
            />
            <Column field="soldAmount" header="Sold Amount" sortable />
            <Column
              field="soldAt"
              header="Sold At"
              sortable
              body={soldAtBodyTemplate}
            />
            <Column
              field="type"
              header="Type"
              sortable
              body={typeBodyTemplate}
            />
            <Column header="Sell" body={sellBodyTemplate}></Column>
          </DataTable>
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
