import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Asset } from "@/models/asset";
import { Transaction } from "@/models/transaction";
import { Tag } from "primereact/tag";
import { formatCurrency } from "@/utils/utils";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export default function AssetDataTable(props: any) {
  const { HandleSellButton } = props;
  const assets: Asset[] = props.assets;
  const [expandedRows, setExpandedRows] = useState(null);

  const toast: any = useRef(null);

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

  return (
    <React.Fragment>
      <Toast ref={toast} />
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
        <Column field="type" header="Type" sortable body={typeBodyTemplate} />
        <Column header="Sell" body={sellBodyTemplate}></Column>
      </DataTable>
    </React.Fragment>
  );
}
